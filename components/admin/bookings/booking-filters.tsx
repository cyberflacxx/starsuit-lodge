import Link from "next/link";
import type { BranchSummary, BookingStatus, PaymentStatus } from "@/types";

type BookingFiltersProps = {
  branches: BranchSummary[];
  isSuperAdmin: boolean;
  values: {
    branchId?: string;
    status?: string;
    paymentStatus?: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
  };
};

const bookingStatuses: Array<BookingStatus> = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "NO_SHOW",
];

const paymentStatuses: Array<PaymentStatus> = [
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

export function BookingFilters({
  branches,
  isSuperAdmin,
  values,
}: BookingFiltersProps) {
  return (
    <form className="surface-card grid gap-4 px-6 py-6 md:grid-cols-2 xl:grid-cols-6">
      {isSuperAdmin ? (
        <div>
          <label htmlFor="branchId" className="mb-2 block text-sm font-semibold text-foreground">
            Branch
          </label>
          <select
            id="branchId"
            name="branchId"
            defaultValue={values.branchId ?? ""}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
          >
            <option value="">All branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="status" className="mb-2 block text-sm font-semibold text-foreground">
          Booking status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={values.status ?? ""}
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        >
          <option value="">All statuses</option>
          {bookingStatuses.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="paymentStatus" className="mb-2 block text-sm font-semibold text-foreground">
          Payment status
        </label>
        <select
          id="paymentStatus"
          name="paymentStatus"
          defaultValue={values.paymentStatus ?? ""}
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        >
          <option value="">All payments</option>
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="search" className="mb-2 block text-sm font-semibold text-foreground">
          Search
        </label>
        <input
          id="search"
          name="search"
          defaultValue={values.search ?? ""}
          placeholder="Reference or guest"
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        />
      </div>

      <div>
        <label htmlFor="fromDate" className="mb-2 block text-sm font-semibold text-foreground">
          From date
        </label>
        <input
          id="fromDate"
          name="fromDate"
          type="date"
          defaultValue={values.fromDate ?? ""}
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
          defaultValue={values.toDate ?? ""}
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        />
      </div>

      <div className="flex items-end gap-3">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white"
        >
          Apply Filters
        </button>
        <Link
          href="/admin/bookings"
          className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}
