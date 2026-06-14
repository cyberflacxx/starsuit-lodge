export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getBookingsReportRows,
  getRevenueTrend,
} from "@/lib/admin/reports";
import { createBookingsReportCsv, createRevenueReportCsv } from "@/lib/reports/csv";
import { reportFilterSchema } from "@/lib/validations/reports";

function getFilterValues(request: NextRequest) {
  return reportFilterSchema.safeParse({
    branchId: request.nextUrl.searchParams.get("branchId") ?? undefined,
    fromDate: request.nextUrl.searchParams.get("fromDate") ?? undefined,
    toDate: request.nextUrl.searchParams.get("toDate") ?? undefined,
    preset: request.nextUrl.searchParams.get("preset") ?? "LAST_30_DAYS",
  });
}

export async function GET(request: NextRequest) {
  const adminUser = await requireAdmin();
  const type = request.nextUrl.searchParams.get("type");
  const parsed = getFilterValues(request);
  const filters = parsed.success ? parsed.data : { preset: "LAST_30_DAYS" as const };
  const stamp = new Date().toISOString().slice(0, 10);

  if (type === "revenue") {
    if (adminUser.role === "RECEPTIONIST") {
      return new Response("Revenue access is restricted to management roles.", {
        status: 403,
      });
    }

    const rows = await getRevenueTrend(adminUser, filters);
    const csv = createRevenueReportCsv(
      rows.map((row) => ({
        date: row.date,
        paidRevenue: row.paidRevenue.toFixed(2),
        pendingRevenue: row.pendingRevenue.toFixed(2),
      })),
    );

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="starsuit-report-revenue-${stamp}.csv"`,
      },
    });
  }

  const rows = await getBookingsReportRows(adminUser, filters);
  const csv = createBookingsReportCsv(rows);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="starsuit-report-bookings-${stamp}.csv"`,
    },
  });
}
