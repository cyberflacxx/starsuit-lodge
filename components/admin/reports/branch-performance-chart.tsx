"use client";

import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import { ReportEmptyState } from "@/components/admin/reports/report-empty-state";

type BranchPerformanceRow = {
  branchId: string;
  branchName: string;
  city: string;
  bookings: number;
  confirmedBookings: number;
  paidRevenue: number;
  pendingPayments: number;
  occupancyRate: number;
};

type BranchPerformanceChartProps = {
  data: BranchPerformanceRow[];
};

export function BranchPerformanceChart({ data }: BranchPerformanceChartProps) {
  if (!data.length) {
    return (
      <ReportEmptyState
        title="No branch data is available for this period."
        description="Branch performance appears when branches and bookings exist in scope."
      />
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d5dceb" />
          <XAxis dataKey="branchName" stroke="#10233f" tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" allowDecimals={false} stroke="#10233f" tickLine={false} axisLine={false} />
          <YAxis yAxisId="right" orientation="right" stroke="#10233f" tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="bookings" fill="#0b3d91" radius={[10, 10, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="occupancyRate" stroke="#d72638" strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
