import type {
  AdminNotificationPayload,
  BookingNotificationPayload,
  PaymentNotificationPayload,
} from "@/lib/notifications/types";

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function wrapEmail(title: string, body: string, warning?: string) {
  const warningBlock = warning
    ? `<p style="margin:0 0 20px;padding:12px 16px;border-radius:12px;background:#FCEBEC;color:#D72638;font-size:14px;line-height:1.6;">${warning}</p>`
    : "";

  return `
    <div style="font-family:Arial,sans-serif;background:#F5F8FF;padding:24px;color:#071A33;">
      <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E5EAF4;">
        <div style="background:#0B3D91;color:#FFFFFF;padding:24px 28px;">
          <h1 style="margin:0;font-size:24px;">Starsuit Lodges</h1>
          <p style="margin:8px 0 0;font-size:14px;opacity:0.88;">${title}</p>
        </div>
        <div style="padding:28px;">
          ${warningBlock}
          ${body}
        </div>
      </div>
    </div>
  `;
}

function bookingFacts(payload: BookingNotificationPayload | PaymentNotificationPayload) {
  return `
    <ul style="padding-left:18px;margin:16px 0;color:#071A33;line-height:1.8;">
      <li>Booking reference: <strong>${payload.bookingReference}</strong></li>
      <li>Branch: <strong>${payload.branchName}</strong></li>
      <li>Room: <strong>${payload.roomTypeName}${payload.roomNumber ? ` | Room ${payload.roomNumber}` : ""}</strong></li>
      <li>Check-in: <strong>${formatDateLabel(payload.checkInDate)}</strong></li>
      <li>Check-out: <strong>${formatDateLabel(payload.checkOutDate)}</strong></li>
      <li>Booking status: <strong>${payload.bookingStatus}</strong></li>
      <li>Payment status: <strong>${payload.paymentStatus}</strong></li>
    </ul>
  `;
}

function createTextBlock(lines: string[]) {
  return lines.filter(Boolean).join("\n");
}

export function bookingCreatedEmail(payload: BookingNotificationPayload) {
  const subject = `Booking received: ${payload.bookingReference}`;
  const html = wrapEmail(
    "Booking created",
    `
      <p>Hello ${payload.guestName},</p>
      <p>Your booking has been created successfully. We have recorded your stay request and payment is currently marked as ${payload.paymentStatus}.</p>
      ${bookingFacts(payload)}
      <p>Payment page: <a href="${payload.paymentUrl}">${payload.paymentUrl}</a></p>
      <p>Guest status page: <a href="${payload.guestSuccessUrl}">${payload.guestSuccessUrl}</a></p>
      <p>If needed, our team may contact you by phone or WhatsApp.</p>
    `,
  );
  const text = createTextBlock([
    `Hello ${payload.guestName},`,
    `Your booking has been created successfully.`,
    `Booking reference: ${payload.bookingReference}`,
    `Branch: ${payload.branchName}`,
    `Check-in: ${formatDateLabel(payload.checkInDate)}`,
    `Check-out: ${formatDateLabel(payload.checkOutDate)}`,
    `Payment page: ${payload.paymentUrl}`,
    `Guest status page: ${payload.guestSuccessUrl}`,
  ]);

  return { subject, html, text };
}

export function paymentSubmittedEmail(payload: PaymentNotificationPayload) {
  const subject = `Payment submitted: ${payload.bookingReference}`;
  const html = wrapEmail(
    "Mock payment submitted",
    `
      <p>Hello ${payload.guestName},</p>
      <p>Your mock EcoCash payment confirmation has been received and is awaiting verification by lodge staff.</p>
      ${bookingFacts(payload)}
      <p>Track your booking: <a href="${payload.guestSuccessUrl}">${payload.guestSuccessUrl}</a></p>
    `,
    "This is a demo notification. Payment remains pending until staff verify it.",
  );
  const text = createTextBlock([
    `Hello ${payload.guestName},`,
    `Your mock EcoCash payment confirmation has been received and is awaiting verification.`,
    `Booking reference: ${payload.bookingReference}`,
    `Guest status page: ${payload.guestSuccessUrl}`,
  ]);

  return { subject, html, text };
}

export function paymentVerifiedEmail(payload: PaymentNotificationPayload) {
  const subject = `Payment verified: ${payload.bookingReference}`;
  const html = wrapEmail(
    "Payment verified",
    `
      <p>Hello ${payload.guestName},</p>
      <p>Your payment has been verified by Starsuit Lodges.</p>
      ${bookingFacts(payload)}
      <p>You can review the latest booking status here: <a href="${payload.guestSuccessUrl}">${payload.guestSuccessUrl}</a></p>
    `,
  );
  const text = createTextBlock([
    `Hello ${payload.guestName},`,
    `Your payment has been verified.`,
    `Booking reference: ${payload.bookingReference}`,
    `Guest status page: ${payload.guestSuccessUrl}`,
  ]);

  return { subject, html, text };
}

export function bookingConfirmedEmail(payload: BookingNotificationPayload) {
  const subject = `Booking confirmed: ${payload.bookingReference}`;
  const html = wrapEmail(
    "Booking confirmed",
    `
      <p>Hello ${payload.guestName},</p>
      <p>Your booking is now confirmed.</p>
      ${bookingFacts(payload)}
      <p>Please keep your booking reference handy when you arrive.</p>
    `,
  );
  const text = createTextBlock([
    `Hello ${payload.guestName},`,
    `Your booking is now confirmed.`,
    `Booking reference: ${payload.bookingReference}`,
  ]);

  return { subject, html, text };
}

export function bookingCancelledEmail(payload: BookingNotificationPayload) {
  const subject = `Booking cancelled: ${payload.bookingReference}`;
  const html = wrapEmail(
    "Booking cancelled",
    `
      <p>Hello ${payload.guestName},</p>
      <p>Your booking has been cancelled.</p>
      ${bookingFacts(payload)}
      <p>If you need help, contact us at ${payload.contactEmail}.</p>
    `,
    payload.specialRequests ?? "Please contact Starsuit Lodges if you need support with this cancellation.",
  );
  const text = createTextBlock([
    `Hello ${payload.guestName},`,
    `Your booking has been cancelled.`,
    `Booking reference: ${payload.bookingReference}`,
    `Contact: ${payload.contactEmail}`,
  ]);

  return { subject, html, text };
}

export function guestCheckedInEmail(payload: BookingNotificationPayload) {
  const subject = `Checked in: ${payload.bookingReference}`;
  const html = wrapEmail(
    "Guest checked in",
    `<p>Hello ${payload.guestName},</p><p>Your check-in has been recorded. Welcome to ${payload.branchName}.</p>${bookingFacts(payload)}`,
  );
  const text = createTextBlock([
    `Hello ${payload.guestName},`,
    `Your check-in has been recorded.`,
    `Booking reference: ${payload.bookingReference}`,
  ]);
  return { subject, html, text };
}

export function guestCheckedOutEmail(payload: BookingNotificationPayload) {
  const subject = `Thank you for staying with Starsuit Lodges`;
  const html = wrapEmail(
    "Checked out",
    `<p>Hello ${payload.guestName},</p><p>Thank you for staying with Starsuit Lodges. Your check-out has been recorded.</p>${bookingFacts(payload)}`,
  );
  const text = createTextBlock([
    `Hello ${payload.guestName},`,
    `Thank you for staying with Starsuit Lodges.`,
    `Booking reference: ${payload.bookingReference}`,
  ]);
  return { subject, html, text };
}

export function noShowEmail(payload: BookingNotificationPayload) {
  const subject = `Booking no-show: ${payload.bookingReference}`;
  const html = wrapEmail(
    "No-show recorded",
    `<p>Hello ${payload.guestName},</p><p>Your booking has been marked as a no-show. Contact Starsuit Lodges if this needs review.</p>${bookingFacts(payload)}`,
    "Please contact the lodge if you believe this status is incorrect.",
  );
  const text = createTextBlock([
    `Hello ${payload.guestName},`,
    `Your booking has been marked as a no-show.`,
    `Booking reference: ${payload.bookingReference}`,
  ]);
  return { subject, html, text };
}

export function adminNewBookingEmail(payload: AdminNotificationPayload) {
  const subject = `New booking created: ${payload.bookingReference}`;
  const html = wrapEmail(
    "Admin booking alert",
    `
      <p>A new booking has been created for ${payload.branchName}.</p>
      <ul style="padding-left:18px;margin:16px 0;color:#071A33;line-height:1.8;">
        <li>Booking reference: <strong>${payload.bookingReference}</strong></li>
        <li>Guest: <strong>${payload.guestName}</strong></li>
        <li>Phone: <strong>${payload.guestPhone}</strong></li>
        <li>Email: <strong>${payload.guestEmail}</strong></li>
        <li>Check-in: <strong>${formatDateLabel(payload.checkInDate)}</strong></li>
        <li>Check-out: <strong>${formatDateLabel(payload.checkOutDate)}</strong></li>
        <li>Payment status: <strong>${payload.paymentStatus}</strong></li>
      </ul>
      <p>Review booking: <a href="${payload.detailUrl}">${payload.detailUrl}</a></p>
    `,
  );
  const text = createTextBlock([
    `A new booking has been created for ${payload.branchName}.`,
    `Booking reference: ${payload.bookingReference}`,
    `Guest: ${payload.guestName}`,
    `Review booking: ${payload.detailUrl}`,
  ]);
  return { subject, html, text };
}

export function adminPaymentSubmittedEmail(payload: AdminNotificationPayload) {
  const subject = `Payment submitted: ${payload.bookingReference}`;
  const html = wrapEmail(
    "Admin payment alert",
    `
      <p>A guest has submitted a mock EcoCash payment confirmation.</p>
      <ul style="padding-left:18px;margin:16px 0;color:#071A33;line-height:1.8;">
        <li>Booking reference: <strong>${payload.bookingReference}</strong></li>
        <li>Guest: <strong>${payload.guestName}</strong></li>
        <li>Branch: <strong>${payload.branchName}</strong></li>
        <li>Payment status: <strong>${payload.paymentStatus}</strong></li>
      </ul>
      <p>Review booking: <a href="${payload.detailUrl}">${payload.detailUrl}</a></p>
    `,
    "Verify the mock EcoCash payment before marking it as paid.",
  );
  const text = createTextBlock([
    `A guest has submitted a mock EcoCash payment confirmation.`,
    `Booking reference: ${payload.bookingReference}`,
    `Guest: ${payload.guestName}`,
    `Review booking: ${payload.detailUrl}`,
  ]);
  return { subject, html, text };
}
