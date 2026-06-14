import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { BranchForm } from "@/components/admin/branch-form";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getBranchForAdmin } from "@/lib/admin/branches";
import { updateBranchAction } from "@/app/admin/(protected)/branches/actions";

type EditBranchPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBranchPage({ params }: EditBranchPageProps) {
  const adminUser = await requireAdmin();
  const { id } = await params;

  if (adminUser.role === UserRole.RECEPTIONIST) {
    redirect("/admin/branches");
  }

  const branch = await getBranchForAdmin(adminUser, id);

  if (!branch) {
    notFound();
  }

  const boundAction = updateBranchAction.bind(null, branch.id);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Edit Branch"
        title={branch.name}
        description="Update the branch details that appear on the public website and branch management screens."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/branches">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Branches
            </Link>
          </Button>
        }
      />

      <BranchForm
        branch={branch}
        submitAction={boundAction}
        canEditSlug={adminUser.role === UserRole.SUPER_ADMIN}
      />
    </section>
  );
}
