import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { GuestBookingForm } from "@/components/booking/guest-booking-form";
import { BookingProgress } from "@/components/booking/booking-progress";
import { Button } from "@/components/ui/button";
import { createGuestBookingAction } from "@/app/booking/details/actions";
import { getAvailabilitySummary } from "@/lib/availability";
import { availabilitySearchSchema } from "@/lib/validations/availability";
import { getActiveBranchSummaries } from "@/lib/public-data";

type BookingDetailsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingDetailsPage({
  searchParams,
}: BookingDetailsPageProps) {
  const params = await searchParams;
  const roomId = typeof params.roomId === "string" ? params.roomId : undefined;

  if (
    typeof params.branchId !== "string" ||
    typeof params.roomTypeId !== "string" ||
    typeof params.checkInDate !== "string" ||
    typeof params.checkOutDate !== "string" ||
    typeof params.guests !== "string"
  ) {
    return <BookingErrorCard message="Booking details are missing. Please start again from availability search." />;
  }

  const parsed = availabilitySearchSchema.safeParse({
    branchId: params.branchId,
    roomTypeId: params.roomTypeId,
    checkInDate: params.checkInDate,
    checkOutDate: params.checkOutDate,
    numberOfGuests: params.guests,
  });

  if (!parsed.success) {
    return <BookingErrorCard message="Your booking dates or guest details are invalid. Please search again." />;
  }

  const [summary, branches] = await Promise.all([
    getAvailabilitySummary(parsed.data),
    getActiveBranchSummaries(),
  ]);

  const branch = branches.find((item) => item.id === parsed.data.branchId);

  if (!branch || !summary.roomType) {
    return <BookingErrorCard message="Selected branch or room type could not be found. Please search again." />;
  }

  if (!summary.availableRooms.length) {
    return <BookingErrorCard message="No rooms available. Please search again." />;
  }

  const selectedRoom = roomId
    ? summary.availableRooms.find((room) => room.id === roomId) ?? null
    : null;

  const roomUnavailableMessage =
    roomId && !selectedRoom
      ? "The selected room is no longer available. Please choose another available room below."
      : null;

  return (
    <section className="section-gap">
      <div className="shell space-y-8">
        <BookingProgress
          currentStep={2}
          steps={["Availability", "Guest Details", "Review", "Payment"]}
        />

        <div className="surface-card px-6 py-8 sm:px-8 lg:px-10">
          <span className="eyebrow">Guest Booking</span>
          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
            Complete your stay details
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            Confirm your room, enter guest details, and create a pending booking before moving to the mock EcoCash payment screen.
          </p>

          {roomUnavailableMessage ? (
            <div className="mt-6 rounded-[1.6rem] border border-accent/20 bg-accent/8 px-5 py-4 text-sm text-accent">
              {roomUnavailableMessage}
            </div>
          ) : null}

          <div className="mt-8">
            <GuestBookingForm
              branch={branch}
              roomType={{
                id: summary.roomType.id,
                name: summary.roomType.name,
              }}
              checkInDate={summary.checkInDate}
              checkOutDate={summary.checkOutDate}
              numberOfGuests={summary.numberOfGuests}
              availableRooms={summary.availableRooms}
              initialRoomId={selectedRoom?.id}
              submitAction={createGuestBookingAction}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingErrorCard({ message }: { message: string }) {
  return (
    <section className="section-gap">
      <div className="shell">
        <div className="surface-card px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="flex items-center gap-3 text-accent">
            <CircleAlert className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em]">
              Booking unavailable
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">We could not continue this booking</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {message}
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/booking">Back to Availability Search</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
