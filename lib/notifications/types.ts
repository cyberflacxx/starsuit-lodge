export type NotificationEventType =
  | "BOOKING_CREATED"
  | "MOCK_PAYMENT_SUBMITTED"
  | "PAYMENT_VERIFIED"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "GUEST_CHECKED_IN"
  | "GUEST_CHECKED_OUT"
  | "BOOKING_NO_SHOW";

export type NotificationResult = {
  success: boolean;
  skipped?: boolean;
  message: string;
  channel: "email" | "whatsapp" | "dashboard";
};

export type EmailRecipient = {
  email: string;
  name?: string;
};

export type BookingNotificationPayload = {
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  branchName: string;
  branchEmail: string | null;
  roomTypeName: string;
  roomNumber: string | null;
  checkInDate: string;
  checkOutDate: string;
  expectedArrivalTime: string;
  numberOfGuests: number;
  bookingStatus: string;
  paymentStatus: string;
  totalAmount: number;
  specialRequests?: string | null;
  guestSuccessUrl: string;
  paymentUrl: string;
  contactEmail: string;
};

export type PaymentNotificationPayload = BookingNotificationPayload & {
  paymentMethod: string;
  transactionReference?: string | null;
  providerReference?: string | null;
  note?: string | null;
};

export type AdminNotificationPayload = {
  branchName: string;
  branchEmail: string | null;
  bookingReference: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  bookingStatus: string;
  paymentStatus: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  detailUrl: string;
};
