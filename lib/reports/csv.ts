function escapeCsvValue(value: string | number | null | undefined) {
  const stringValue = value === null || value === undefined ? "" : String(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }

  return stringValue;
}

export function convertRowsToCsv(rows: Array<Record<string, string | number | null | undefined>>) {
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ];

  return lines.join("\n");
}

export function createBookingsReportCsv(
  bookings: Array<Record<string, string | number | null | undefined>>,
) {
  const headersOnly = [
    {
      bookingReference: "",
      guestName: "",
      phone: "",
      branch: "",
      room: "",
      checkInDate: "",
      checkOutDate: "",
      status: "",
      paymentStatus: "",
      totalAmount: "",
    },
  ];

  return convertRowsToCsv(bookings.length ? bookings : headersOnly);
}

export function createRevenueReportCsv(
  rows: Array<Record<string, string | number | null | undefined>>,
) {
  const headersOnly = [
    {
      date: "",
      paidRevenue: "",
      pendingRevenue: "",
    },
  ];

  return convertRowsToCsv(rows.length ? rows : headersOnly);
}
