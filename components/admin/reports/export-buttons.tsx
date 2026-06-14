import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ReportFilterValues } from "@/lib/validations/reports";

type ExportButtonsProps = {
  filters: ReportFilterValues;
};

function buildQueryString(filters: ReportFilterValues, type: "bookings" | "revenue") {
  const params = new URLSearchParams();
  params.set("type", type);

  if (filters.preset) {
    params.set("preset", filters.preset);
  }

  if (filters.fromDate) {
    params.set("fromDate", filters.fromDate);
  }

  if (filters.toDate) {
    params.set("toDate", filters.toDate);
  }

  if (filters.branchId) {
    params.set("branchId", filters.branchId);
  }

  return `/admin/reports/export?${params.toString()}`;
}

export function ExportButtons({ filters }: ExportButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild variant="outline">
        <Link href={buildQueryString(filters, "bookings")}>Export Bookings CSV</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href={buildQueryString(filters, "revenue")}>Export Revenue CSV</Link>
      </Button>
    </div>
  );
}
