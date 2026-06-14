import type { ReportFilterValues } from "@/lib/validations/reports";

type ReportPreset = NonNullable<ReportFilterValues["preset"]>;

export type NormalisedReportDateRange = {
  fromDate: Date;
  toDate: Date;
  fromDateInput: string;
  toDateInput: string;
  preset: ReportPreset;
};

const UTC_DAY_MS = 86400000;

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number) {
  return new Date(date.getTime() + days * UTC_DAY_MS);
}

function endOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDateInput(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getPresetDateRange(preset: ReportPreset, now = new Date()) {
  const today = startOfUtcDay(now);

  switch (preset) {
    case "TODAY":
      return {
        fromDate: today,
        toDate: endOfUtcDay(today),
      };
    case "THIS_WEEK": {
      const day = today.getUTCDay();
      const offset = day === 0 ? 6 : day - 1;
      const fromDate = addUtcDays(today, -offset);
      return {
        fromDate,
        toDate: endOfUtcDay(today),
      };
    }
    case "THIS_MONTH": {
      const fromDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
      return {
        fromDate,
        toDate: endOfUtcDay(today),
      };
    }
    case "LAST_30_DAYS":
      return {
        fromDate: addUtcDays(today, -29),
        toDate: endOfUtcDay(today),
      };
    case "THIS_YEAR": {
      const fromDate = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));
      return {
        fromDate,
        toDate: endOfUtcDay(today),
      };
    }
    case "CUSTOM":
    default:
      return {
        fromDate: today,
        toDate: endOfUtcDay(today),
      };
  }
}

export function normaliseReportDateRange(filters: ReportFilterValues): NormalisedReportDateRange {
  const preset = filters.preset ?? "LAST_30_DAYS";

  if (preset === "CUSTOM") {
    const fromDate = startOfUtcDay(parseDateInput(filters.fromDate) ?? new Date());
    const toDate = endOfUtcDay(parseDateInput(filters.toDate) ?? new Date());

    return {
      fromDate,
      toDate,
      fromDateInput: toDateInput(fromDate),
      toDateInput: toDateInput(toDate),
      preset,
    };
  }

  const range = getPresetDateRange(preset);
  return {
    ...range,
    fromDateInput: toDateInput(range.fromDate),
    toDateInput: toDateInput(range.toDate),
    preset,
  };
}

export function formatReportDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function getDateBuckets(fromDate: Date, toDate: Date) {
  const buckets: string[] = [];
  let cursor = startOfUtcDay(fromDate);
  const end = startOfUtcDay(toDate);

  while (cursor <= end) {
    buckets.push(toDateInput(cursor));
    cursor = addUtcDays(cursor, 1);
  }

  return buckets;
}
