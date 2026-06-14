"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ReportEmptyState } from "@/components/admin/reports/report-empty-state";

type RevenueTrendRow = {
  date: string;
  label: string;
  paidRevenue: number;
  pendingRevenue: number;
};

type RevenueTrendChartProps = {
  data: RevenueTrendRow[];
};

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  if (!data.length) {
    return (
      <ReportEmptyState
        title="No revenue data is available for this period."
        description="Revenue trend data will appear once bookings and payment states exist."
      />
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d5dceb" />
          <XAxis dataKey="label" stroke="#10233f" tickLine={false} axisLine={false} />
          <YAxis stroke="#10233f" tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="paidRevenue"
            stroke="#0b3d91"
            fill="#0b3d91"
            fillOpacity={0.18}
          />
          <Area
            type="monotone"
            dataKey="pendingRevenue"
            stroke="#d72638"
            fill="#d72638"
            fillOpacity={0.14}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
