"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ReportEmptyState } from "@/components/admin/reports/report-empty-state";

type BookingTrendRow = {
  date: string;
  label: string;
  bookings: number;
  confirmed: number;
  cancelled: number;
};

type BookingTrendChartProps = {
  data: BookingTrendRow[];
};

export function BookingTrendChart({ data }: BookingTrendChartProps) {
  if (!data.length) {
    return (
      <ReportEmptyState
        title="No booking data is available for this period."
        description="Booking trend data will appear once bookings exist in the selected date range."
      />
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d5dceb" />
          <XAxis dataKey="label" stroke="#10233f" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} stroke="#10233f" tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#0b3d91" radius={[10, 10, 0, 0]} />
          <Bar dataKey="confirmed" fill="#133a63" radius={[10, 10, 0, 0]} />
          <Bar dataKey="cancelled" fill="#d72638" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
