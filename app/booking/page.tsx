import { BookingSteps } from "@/components/booking/booking-steps";
import { AvailabilitySearchForm } from "@/components/booking/availability-search-form";
import { PageHero } from "@/components/public/page-hero";
import { checkAvailabilityAction } from "@/app/booking/actions";
import {
  getActiveBranchSummaries,
  getActiveRoomTypes,
  getContentBlock,
} from "@/lib/public-data";

const bookingSteps = [
  {
    id: "choose",
    order: 1,
    title: "Choose branch and dates",
    description: "Select the Starsuit branch you want and define your travel window.",
  },
  {
    id: "availability",
    order: 2,
    title: "Check availability",
    description: "See which rooms are free before arrival and avoid fully booked surprises.",
  },
  {
    id: "guest-details",
    order: 3,
    title: "Enter guest details",
    description: "Module 8 will collect guest information after availability is confirmed.",
  },
  {
    id: "payment",
    order: 4,
    title: "Confirm mock EcoCash payment",
    description: "Payment handling comes later, after the booking details flow is active.",
  },
] as const;

type BookingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  const [branches, roomTypes, bookingPolicyBlock, cancellationPolicyBlock] =
    await Promise.all([
    getActiveBranchSummaries(),
    getActiveRoomTypes(),
    getContentBlock("booking-policy"),
    getContentBlock("cancellation-policy"),
  ]);
  const branchParam = typeof params.branch === "string" ? params.branch.toLowerCase() : "";
  const defaultBranchId =
    branches.find((branch) => {
      const slug = branch.slug.toLowerCase();
      const publicSlug = branch.publicSlug.toLowerCase();
      const city = branch.city.toLowerCase();

      return (
        branch.id === branchParam ||
        slug === branchParam ||
        publicSlug === branchParam ||
        city === branchParam
      );
    })?.id ?? undefined;

  return (
    <>
      <PageHero
        eyebrow="Book a Room"
        title={bookingPolicyBlock?.title ?? "Reserve your stay at Starsuit Lodges."}
        description={
          bookingPolicyBlock?.body ??
          "Choose your branch, pick your dates, and confirm your room in minutes. Live availability across Mutare and Chipinge."
        }
        actions={[
          { label: "Check Availability Below", href: "#availability" },
          { label: "View Room Types", href: "/rooms", variant: "outline" },
        ]}
        imageKey="booking"
      />

      <section id="availability" className="section-gap bg-white">
        <div className="shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="surface-card px-6 py-8 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Availability Search
              </p>
              <h2 className="mt-4 text-3xl font-semibold">Check live room availability</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                {bookingPolicyBlock?.body ??
                  "Search by branch, room type, dates, and guest count. The engine checks room status, maintenance blocks, and overlapping active bookings."}
              </p>
              <div className="mt-8">
                <AvailabilitySearchForm
                  branches={branches}
                  roomTypes={roomTypes}
                  submitAction={checkAvailabilityAction}
                  defaultBranchId={defaultBranchId}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <BookingSteps steps={[...bookingSteps]} />
            <div className="surface-card px-6 py-7 sm:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Mobile Booking Focus
              </p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {cancellationPolicyBlock?.body ??
                  "This screen is designed to work smoothly on phones first, making it easy for guests to search while traveling."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
