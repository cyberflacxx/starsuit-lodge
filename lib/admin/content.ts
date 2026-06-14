import "server-only";

import { AuditAction, ContentStatus, Prisma, UserRole } from "@prisma/client";
import type { AuthenticatedAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type {
  ContentBlockFormValues,
  GalleryImageFormValues,
  ServiceFormValues,
} from "@/lib/validations/content";

function canViewBranchEntity(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  branchId: string | null,
) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  if (!adminUser.branchId) {
    return false;
  }

  return branchId === null || branchId === adminUser.branchId;
}

function canManageBranchEntity(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  branchId: string | null,
) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  if (adminUser.role === UserRole.RECEPTIONIST || !adminUser.branchId) {
    return false;
  }

  return branchId === adminUser.branchId;
}

function getScopedWhere(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
): Prisma.ContentBlockWhereInput | null {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return {};
  }

  if (!adminUser.branchId) {
    return null;
  }

  return {
    OR: [{ branchId: null }, { branchId: adminUser.branchId }],
  };
}

function ensureEditableRole(adminUser: Pick<AuthenticatedAdmin, "role">) {
  if (adminUser.role === UserRole.RECEPTIONIST) {
    throw new Error("Receptionists can view content but cannot edit it.");
  }
}

function buildAuditMetadata(
  branchId: string | null,
  changedFields?: Prisma.InputJsonObject,
): Prisma.InputJsonObject {
  return {
    branchId,
    changedFields: changedFields ?? null,
  };
}

export async function getContentBlocksForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
) {
  const where = getScopedWhere(adminUser);

  if (where === null) {
    return [];
  }

  return prisma.contentBlock.findMany({
    where,
    include: {
      branch: true,
    },
    orderBy: [{ key: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getContentBlockForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  id: string,
) {
  const block = await prisma.contentBlock.findUnique({
    where: { id },
    include: { branch: true },
  });

  if (!block || !canViewBranchEntity(adminUser, block.branchId)) {
    return null;
  }

  return block;
}

export async function createContentBlockForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  data: ContentBlockFormValues,
) {
  ensureEditableRole(adminUser);

  if (!canManageBranchEntity(adminUser, data.branchId ?? null)) {
    throw new Error("You do not have access to create content for this branch.");
  }

  return prisma.contentBlock.create({
    data: {
      key: data.key,
      title: data.title,
      body: data.body,
      branchId: data.branchId ?? null,
      status: data.status as ContentStatus,
    },
  }).then(async (block) => {
    await prisma.auditLog.create({
      data: {
        adminUserId: adminUser.id,
        action: AuditAction.CREATE,
        entity: "ContentBlock",
        entityId: block.id,
        description: `Content block ${block.key} created.`,
        metadata: buildAuditMetadata(block.branchId, {
          key: block.key,
          status: block.status,
        }),
      },
    });

    return block;
  });
}

export async function updateContentBlockForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  id: string,
  data: ContentBlockFormValues,
) {
  ensureEditableRole(adminUser);
  const existing = await getContentBlockForAdmin(adminUser, id);

  if (!existing) {
    throw new Error("Content block not found or access denied.");
  }

  if (!canManageBranchEntity(adminUser, existing.branchId)) {
    throw new Error("You do not have access to edit this content block.");
  }

  if (!canManageBranchEntity(adminUser, data.branchId ?? null)) {
    throw new Error("You do not have access to move this content block to that branch.");
  }

  const updated = await prisma.contentBlock.update({
    where: { id },
    data: {
      key: data.key,
      title: data.title,
      body: data.body,
      branchId: data.branchId ?? null,
      status: data.status as ContentStatus,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: adminUser.id,
      action: AuditAction.UPDATE,
      entity: "ContentBlock",
      entityId: updated.id,
      description: `Content block ${updated.key} updated.`,
      metadata: buildAuditMetadata(updated.branchId, {
        key: updated.key,
        status: updated.status,
      }),
    },
  });

  return updated;
}

export async function getServicesForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
) {
  const where =
    adminUser.role === UserRole.SUPER_ADMIN
      ? {}
      : adminUser.branchId
        ? { OR: [{ branchId: null }, { branchId: adminUser.branchId }] }
        : null;

  if (where === null) {
    return [];
  }

  return prisma.service.findMany({
    where,
    include: { branch: true },
    orderBy: [{ title: "asc" }, { createdAt: "desc" }],
  });
}

export async function createServiceForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  data: ServiceFormValues,
) {
  ensureEditableRole(adminUser);

  if (!canManageBranchEntity(adminUser, data.branchId ?? null)) {
    throw new Error("You do not have access to create a service for this branch.");
  }

  const service = await prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      iconName: data.iconName || null,
      branchId: data.branchId ?? null,
      isActive: data.isActive,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: adminUser.id,
      action: AuditAction.CREATE,
      entity: "Service",
      entityId: service.id,
      description: `Service ${service.title} created.`,
      metadata: buildAuditMetadata(service.branchId, {
        isActive: service.isActive,
      }),
    },
  });

  return service;
}

export async function getServiceForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  id: string,
) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: { branch: true },
  });

  if (!service || !canViewBranchEntity(adminUser, service.branchId)) {
    return null;
  }

  return service;
}

export async function updateServiceForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  id: string,
  data: ServiceFormValues,
) {
  ensureEditableRole(adminUser);
  const existing = await prisma.service.findUnique({ where: { id } });

  if (!existing || !canManageBranchEntity(adminUser, existing.branchId)) {
    throw new Error("Service not found or access denied.");
  }

  if (!canManageBranchEntity(adminUser, data.branchId ?? null)) {
    throw new Error("You do not have access to move this service to that branch.");
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      iconName: data.iconName || null,
      branchId: data.branchId ?? null,
      isActive: data.isActive,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: adminUser.id,
      action: AuditAction.UPDATE,
      entity: "Service",
      entityId: service.id,
      description: `Service ${service.title} updated.`,
      metadata: buildAuditMetadata(service.branchId, {
        isActive: service.isActive,
      }),
    },
  });

  return service;
}

export async function getGalleryImagesForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
) {
  const where =
    adminUser.role === UserRole.SUPER_ADMIN
      ? {}
      : adminUser.branchId
        ? { OR: [{ branchId: null }, { branchId: adminUser.branchId }] }
        : null;

  if (where === null) {
    return [];
  }

  return prisma.galleryImage.findMany({
    where,
    include: { branch: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function createGalleryImageForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  data: GalleryImageFormValues,
) {
  ensureEditableRole(adminUser);

  if (!canManageBranchEntity(adminUser, data.branchId ?? null)) {
    throw new Error("You do not have access to create a gallery image for this branch.");
  }

  const image = await prisma.galleryImage.create({
    data: {
      title: data.title,
      altText: data.altText,
      imageUrl: data.imageUrl,
      branchId: data.branchId ?? null,
      sortOrder: data.sortOrder,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: adminUser.id,
      action: AuditAction.CREATE,
      entity: "GalleryImage",
      entityId: image.id,
      description: `Gallery image ${image.title} created.`,
      metadata: buildAuditMetadata(image.branchId, {
        isActive: image.isActive,
        isFeatured: image.isFeatured,
      }),
    },
  });

  return image;
}

export async function getGalleryImageForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  id: string,
) {
  const image = await prisma.galleryImage.findUnique({
    where: { id },
    include: { branch: true },
  });

  if (!image || !canViewBranchEntity(adminUser, image.branchId)) {
    return null;
  }

  return image;
}

export async function updateGalleryImageForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  id: string,
  data: GalleryImageFormValues,
) {
  ensureEditableRole(adminUser);
  const existing = await prisma.galleryImage.findUnique({ where: { id } });

  if (!existing || !canManageBranchEntity(adminUser, existing.branchId)) {
    throw new Error("Gallery image not found or access denied.");
  }

  if (!canManageBranchEntity(adminUser, data.branchId ?? null)) {
    throw new Error("You do not have access to move this gallery image to that branch.");
  }

  const image = await prisma.galleryImage.update({
    where: { id },
    data: {
      title: data.title,
      altText: data.altText,
      imageUrl: data.imageUrl,
      branchId: data.branchId ?? null,
      sortOrder: data.sortOrder,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: adminUser.id,
      action: AuditAction.UPDATE,
      entity: "GalleryImage",
      entityId: image.id,
      description: `Gallery image ${image.title} updated.`,
      metadata: buildAuditMetadata(image.branchId, {
        isActive: image.isActive,
        isFeatured: image.isFeatured,
        sortOrder: image.sortOrder,
      }),
    },
  });

  return image;
}

export async function deleteGalleryImageForAdmin(
  adminUser: Pick<AuthenticatedAdmin, "id" | "role" | "branchId">,
  id: string,
) {
  ensureEditableRole(adminUser);
  const existing = await prisma.galleryImage.findUnique({ where: { id } });

  if (!existing || !canManageBranchEntity(adminUser, existing.branchId)) {
    throw new Error("Gallery image not found or access denied.");
  }

  const image = await prisma.galleryImage.update({
    where: { id },
    data: {
      isActive: false,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: adminUser.id,
      action: AuditAction.DELETE,
      entity: "GalleryImage",
      entityId: image.id,
      description: `Gallery image ${image.title} disabled.`,
      metadata: buildAuditMetadata(image.branchId, {
        isActive: false,
      }),
    },
  });

  return image;
}
