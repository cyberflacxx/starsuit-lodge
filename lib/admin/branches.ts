import "server-only";

import { AuditAction, Prisma, UserRole, type Branch } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuthenticatedAdmin } from "@/lib/auth";
import type { BranchFormValues } from "@/lib/validations/branch";

export async function getBranchesForAdmin(adminUser: AuthenticatedAdmin) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return prisma.branch.findMany({
      orderBy: [{ city: "asc" }, { name: "asc" }],
    });
  }

  if (!adminUser.branchId) {
    return [] as Branch[];
  }

  const branch = await prisma.branch.findFirst({
    where: {
      id: adminUser.branchId,
    },
  });

  return branch ? [branch] : [];
}

export async function getBranchForAdmin(
  adminUser: AuthenticatedAdmin,
  branchId: string,
) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return prisma.branch.findUnique({
      where: {
        id: branchId,
      },
    });
  }

  if (!adminUser.branchId || adminUser.branchId !== branchId) {
    return null;
  }

  return prisma.branch.findUnique({
    where: {
      id: branchId,
    },
  });
}

function buildChangedFields(
  existingBranch: Branch,
  data: BranchFormValues,
) {
  const changedFields: Record<string, { before: string | boolean; after: string | boolean }> = {};

  (
    [
      "name",
      "slug",
      "description",
      "address",
      "city",
      "phone",
      "email",
      "mapUrl",
      "isActive",
    ] as const
  ).forEach((field) => {
    const before = existingBranch[field] ?? "";
    const after = data[field] ?? "";

    if (before !== after) {
      changedFields[field] = { before, after };
    }
  });

  return changedFields;
}

export async function updateBranchForAdmin(
  adminUser: AuthenticatedAdmin,
  branchId: string,
  data: BranchFormValues,
) {
  const existingBranch = await getBranchForAdmin(adminUser, branchId);

  if (!existingBranch) {
    throw new Error("Branch not found or you do not have access to it.");
  }

  if (adminUser.role === UserRole.RECEPTIONIST) {
    throw new Error("Receptionists can view branches but cannot edit them.");
  }

  if (
    adminUser.role === UserRole.BRANCH_ADMIN &&
    existingBranch.slug !== data.slug
  ) {
    throw new Error("Branch admins cannot change the branch slug.");
  }

  const changedFields = buildChangedFields(existingBranch, data);

  try {
    return await prisma.branch.update({
      where: {
        id: branchId,
      },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        address: data.address,
        city: data.city,
        phone: data.phone,
        email: data.email,
        mapUrl: data.mapUrl || "",
        isActive: data.isActive,
      },
    }).then(async (updatedBranch) => {
      await prisma.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: AuditAction.UPDATE,
          entity: "Branch",
          entityId: updatedBranch.id,
          description: "Branch details updated",
          metadata: Object.keys(changedFields).length ? changedFields : undefined,
        },
      });

      return updatedBranch;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("That slug is already in use by another branch.");
    }

    throw new Error("Branch update failed. Please try again.");
  }
}
