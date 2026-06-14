import { redirect } from "next/navigation";
import { AuditAction, UserRole, type AdminUser, type Branch } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedAdmin = AdminUser & {
  branch: Branch | null;
};

export async function getCurrentSupabaseUser() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
}

export async function getCurrentAdminUser(): Promise<AuthenticatedAdmin | null> {
  const supabaseUser = await getCurrentSupabaseUser();

  if (!supabaseUser) {
    return null;
  }

  let adminUser = await prisma.adminUser.findUnique({
    where: {
      supabaseUserId: supabaseUser.id,
    },
    include: {
      branch: true,
    },
  });

  if (!adminUser && supabaseUser.email) {
    const adminByEmail = await prisma.adminUser.findUnique({
      where: {
        email: supabaseUser.email,
      },
      include: {
        branch: true,
      },
    });

    if (!adminByEmail) {
      return null;
    }

    if (!adminByEmail.supabaseUserId) {
      adminUser = await prisma.adminUser.update({
        where: {
          id: adminByEmail.id,
        },
        data: {
          supabaseUserId: supabaseUser.id,
          auditLogs: {
            create: [
              {
                action: AuditAction.UPDATE,
                entity: "AdminUser",
                entityId: adminByEmail.id,
                description: "Linked Supabase user id to existing admin record.",
                metadata: {
                  linkedBy: "email-match",
                },
              },
              {
                action: AuditAction.LOGIN,
                entity: "AdminUser",
                entityId: adminByEmail.id,
                description: "Admin authenticated and linked through Supabase Auth.",
              },
            ],
          },
        },
        include: {
          branch: true,
        },
      });
    } else {
      adminUser = adminByEmail;
    }
  }

  if (!adminUser || !adminUser.isActive) {
    return null;
  }

  return adminUser;
}

export async function requireAdmin() {
  const supabaseUser = await getCurrentSupabaseUser();

  if (!supabaseUser) {
    redirect("/admin/login");
  }

  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin/unauthorized");
  }

  return adminUser;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const adminUser = await requireAdmin();

  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return adminUser;
  }

  if (!allowedRoles.includes(adminUser.role)) {
    redirect("/admin/unauthorized");
  }

  return adminUser;
}

export function canAccessBranch(
  adminUser: Pick<AuthenticatedAdmin, "role" | "branchId">,
  branchId: string | null,
) {
  if (adminUser.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  if (!branchId) {
    return false;
  }

  if (adminUser.role === UserRole.BRANCH_ADMIN || adminUser.role === UserRole.RECEPTIONIST) {
    return adminUser.branchId === branchId;
  }

  return false;
}
