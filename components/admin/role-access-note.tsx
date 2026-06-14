import { UserRole } from "@prisma/client";
import { StatusBadge } from "@/components/admin/status-badge";

type RoleAccessNoteProps = {
  role: UserRole;
  hasAssignedBranch: boolean;
};

export function RoleAccessNote({
  role,
  hasAssignedBranch,
}: RoleAccessNoteProps) {
  const message =
    role === UserRole.SUPER_ADMIN
      ? "You can view and edit all Starsuit branches."
      : role === UserRole.BRANCH_ADMIN
        ? "You can manage only your assigned branch."
        : "You can view your assigned branch, but branch editing is disabled.";

  return (
    <div className="surface-card flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Access Note
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{message}</p>
        {!hasAssignedBranch && role !== UserRole.SUPER_ADMIN ? (
          <p className="mt-2 text-sm leading-7 text-accent">
            No branch is assigned to your admin record, so no branch records are available.
          </p>
        ) : null}
      </div>
      <StatusBadge label={role.replace("_", " ")} tone="primary" />
    </div>
  );
}
