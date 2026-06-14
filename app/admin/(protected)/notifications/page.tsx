import { NotificationStatusCard } from "@/components/admin/notification-status-card";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { isEmailConfigured } from "@/lib/notifications/email-client";

const notificationEvents = [
  "Booking Created",
  "Mock Payment Submitted",
  "Payment Verified",
  "Booking Confirmed",
  "Booking Cancelled",
  "Guest Checked In",
  "Guest Checked Out",
  "No Show",
];

export default async function AdminNotificationsPage() {
  await requireAdmin();
  const emailConfigured = isEmailConfigured();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Notifications"
        title="Notifications"
        description="This module sends booking and payment emails when events occur."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <NotificationStatusCard
          title={emailConfigured ? "Email configured" : "Email not configured"}
          description={
            emailConfigured
              ? "SMTP variables are available and booking notifications can be sent."
              : "SMTP variables are missing. Booking flows continue safely and email notifications are skipped."
          }
          status={emailConfigured ? "configured" : "not_configured"}
        />
        <NotificationStatusCard
          title="WhatsApp click-to-chat"
          description="WhatsApp is currently handled through click-to-chat links. Full WhatsApp Business API can be added later."
          status="info"
        />
      </div>

      <div className="surface-card px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-semibold text-foreground">Notification events</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {notificationEvents.map((event) => (
            <div
              key={event}
              className="rounded-[1.6rem] border border-border bg-white px-5 py-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Active event
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">{event}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
