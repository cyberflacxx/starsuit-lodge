import { formatCurrency, formatNumber } from "@/lib/formatters";
import { ReportEmptyState } from "@/components/admin/reports/report-empty-state";

type RoomPerformanceRow = {
  roomId: string;
  roomNumber: string;
  branchName: string;
  roomTypeName: string;
  bookings: number;
  revenue: number;
  occupancyCount: number;
};

type RoomPerformanceTableProps = {
  rows: RoomPerformanceRow[];
};

export function RoomPerformanceTable({ rows }: RoomPerformanceTableProps) {
  if (!rows.length) {
    return (
      <ReportEmptyState
        title="Add rooms first to enable occupancy reports."
        description="Room performance cannot be calculated until branch rooms exist."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <th className="px-4 py-4">Room</th>
            <th className="px-4 py-4">Branch</th>
            <th className="px-4 py-4">Room Type</th>
            <th className="px-4 py-4">Bookings</th>
            <th className="px-4 py-4">Occupancy Count</th>
            <th className="px-4 py-4">Paid Revenue</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm text-foreground">
          {rows.map((row) => (
            <tr key={row.roomId}>
              <td className="px-4 py-4 font-semibold">{row.roomNumber}</td>
              <td className="px-4 py-4">{row.branchName}</td>
              <td className="px-4 py-4">{row.roomTypeName}</td>
              <td className="px-4 py-4">{formatNumber(row.bookings)}</td>
              <td className="px-4 py-4">{formatNumber(row.occupancyCount)}</td>
              <td className="px-4 py-4">{formatCurrency(row.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
