import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import {
  createBookingWhatsAppMessage,
  createWhatsAppLink,
} from "@/lib/notifications/whatsapp";

export function GuestContactButtons({
  bookingReference,
  branchName,
  checkInDate,
  checkOutDate,
  bookingStatus,
  paymentStatus,
  guestName,
  phone,
  email,
}: {
  bookingReference: string;
  branchName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  paymentStatus: string;
  guestName: string;
  phone: string;
  email: string;
}) {
  const normalizedPhone = phone.replace(/\s+/g, "");
  const whatsappLink = createWhatsAppLink(
    phone,
    createBookingWhatsAppMessage({
      bookingReference,
      guestName,
      guestEmail: email,
      guestPhone: phone,
      branchName,
      branchEmail: null,
      roomTypeName: "",
      roomNumber: null,
      checkInDate,
      checkOutDate,
      expectedArrivalTime: "",
      numberOfGuests: 1,
      bookingStatus,
      paymentStatus,
      totalAmount: 0,
      guestSuccessUrl: "",
      paymentUrl: "",
      contactEmail: "",
    }),
  );

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={whatsappLink}
        target="_blank"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </Link>
      <Link
        href={`tel:${normalizedPhone}`}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
      >
        <Phone className="h-4 w-4" />
        Call
      </Link>
      <Link
        href={`mailto:${email}`}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
      >
        <Mail className="h-4 w-4" />
        Email
      </Link>
    </div>
  );
}
