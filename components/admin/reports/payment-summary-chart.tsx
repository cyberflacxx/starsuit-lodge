"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ReportEmptyState } from "@/components/admin/reports/report-empty-state";

type PaymentSummaryRow = {
  status: "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  count: number;
  amount: number;
};

type PaymentSummaryChartProps = {
  data: PaymentSummaryRow[];
};

const colors: Record<PaymentSummaryRow["status"], string> = {
  UNPAID: "#10233f",
  PENDING: "#d72638",
  PAID: "#0b3d91",
  FAILED: "#7f1d1d",
  REFUNDED: "#475569",
};

export function PaymentSummaryChart({ data }: PaymentSummaryChartProps) {
  if (!data.length || data.every((item) => item.count === 0 && item.amount === 0)) {
    return (
      <ReportEmptyState
        title="No payment data is available for this period."
        description="Payment summary data will appear once bookings have payment states in the selected range."
      />
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d5dceb" />
          <XAxis dataKey="status" stroke="#10233f" tickLine={false} axisLine={false} />
          <YAxis stroke="#10233f" tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
            {data.map((item) => (
              <Cell key={item.status} fill={colors[item.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
