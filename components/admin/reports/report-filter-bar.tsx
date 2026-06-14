import { Button } from "@/components/ui/button";
import type { BranchSummary } from "@/types";
import type { ReportFilterValues } from "@/lib/validations/reports";

type ReportFilterBarProps = {
  filters: ReportFilterValues;
  branches: BranchSummary[];
  isSuperAdmin: boolean;
  lockedBranchName?: string | null;
};

const presets = [
  { value: "TODAY", label: "Today" },
  { value: "THIS_WEEK", label: "This Week" },
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_30_DAYS", label: "Last 30 Days" },
  { value: "THIS_YEAR", label: "This Year" },
  { value: "CUSTOM", label: "Custom" },
] as const;

export function ReportFilterBar({
  filters,
  branches,
  isSuperAdmin,
  lockedBranchName,
}: ReportFilterBarProps) {
  return (
    <form
      method="get"
      action="/admin/reports"
      className="surface-card grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-5"
    >
      <div>
        <label htmlFor="preset" className="mb-2 block text-sm font-semibold text-foreground">
          Date preset
        </label>
        <select
          id="preset"
          name="preset"
          defaultValue={filters.preset ?? "LAST_30_DAYS"}
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        >
          {presets.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="fromDate" className="mb-2 block text-sm font-semibold text-foreground">
          From date
        </label>
        <input
          id="fromDate"
          name="fromDate"
          type="date"
          defaultValue={filters.fromDate ?? ""}
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        />
      </div>

      <div>
        <label htmlFor="toDate" className="mb-2 block text-sm font-semibold text-foreground">
          To date
        </label>
        <input
          id="toDate"
          name="toDate"
          type="date"
          defaultValue={filters.toDate ?? ""}
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        />
      </div>

      <div>
        <label htmlFor="branchId" className="mb-2 block text-sm font-semibold text-foreground">
          Branch
        </label>
        {isSuperAdmin ? (
          <select
            id="branchId"
            name="branchId"
            defaultValue={filters.branchId ?? ""}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        ) : (
          <>
            <input type="hidden" name="branchId" value={filters.branchId ?? ""} />
            <input
              id="branchId"
              value={lockedBranchName ?? "Assigned branch only"}
              readOnly
              className="h-12 w-full cursor-not-allowed rounded-2xl border border-border bg-muted px-4 text-sm text-foreground"
            />
          </>
        )}
      </div>

      <div className="flex items-end">
        <Button type="submit" size="lg" className="w-full">
          Apply Filters
        </Button>
      </div>
    </form>
  );
}
