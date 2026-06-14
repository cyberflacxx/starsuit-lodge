"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Car, CheckCircle2, ChevronLeft, ChevronRight, MapPin, User } from "lucide-react";
import { BookingSummaryCard } from "@/components/booking/booking-summary-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AvailabilityRoom, BranchSummary, GuestBookingFormState } from "@/types";

type GuestBookingFormProps = {
  branch: BranchSummary;
  roomType: {
    id: string;
    name: string;
  };
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  availableRooms: AvailabilityRoom[];
  initialRoomId?: string;
  submitAction: (
    state: GuestBookingFormState,
    formData: FormData,
  ) => Promise<GuestBookingFormState>;
};

const initialState: GuestBookingFormState = {
  success: false,
  message: "",
};

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function getNightCount(checkInDate: string, checkOutDate: string) {
  const checkIn = new Date(`${checkInDate}T00:00:00.000Z`);
  const checkOut = new Date(`${checkOutDate}T00:00:00.000Z`);

  return Math.max(
    1,
    Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000),
  );
}

export function GuestBookingForm({
  branch,
  roomType,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  availableRooms,
  initialRoomId,
  submitAction,
}: GuestBookingFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId ?? availableRooms[0]?.id ?? "");
  const [guestCount, setGuestCount] = useState(Math.min(Math.max(numberOfGuests, 1), 2));
  const [transportOption, setTransportOption] = useState<
    "OWN_CAR" | "NEED_PICKUP" | "NO_TRANSPORT_SUPPORT"
  >("NO_TRANSPORT_SUPPORT");
  const [hasOwnCar, setHasOwnCar] = useState(false);
  const [needsParking, setNeedsParking] = useState(false);
  const [needsPickup, setNeedsPickup] = useState(false);
  const [localError, setLocalError] = useState("");

  const selectedRoom =
    availableRooms.find((room) => room.id === selectedRoomId) ?? availableRooms[0] ?? null;
  const nights = getNightCount(checkInDate, checkOutDate);
  const bookingSummary = useMemo(() => {
    if (!selectedRoom) {
      return null;
    }

    return {
      branchName: branch.name,
      roomTypeName: selectedRoom.roomTypeName,
      roomNumber: selectedRoom.roomNumber,
      checkInDate,
      checkOutDate,
      nights,
      numberOfGuests: guestCount,
      pricePerNight: selectedRoom.pricePerNight,
      totalAmount: selectedRoom.pricePerNight * nights,
    };
  }, [branch.name, checkInDate, checkOutDate, guestCount, nights, selectedRoom]);

  useEffect(() => {
    if (state.success && state.redirectTo) {
      startTransition(() => {
        router.push(state.redirectTo!);
      });
    }
  }, [router, startTransition, state.redirectTo, state.success]);

  function getError(field: string) {
    return state.errors?.[field]?.[0];
  }

  function handleTransportOptionChange(
    value: "OWN_CAR" | "NEED_PICKUP" | "NO_TRANSPORT_SUPPORT",
  ) {
    setTransportOption(value);

    if (value === "OWN_CAR") {
      setHasOwnCar(true);
      setNeedsPickup(false);
      return;
    }

    if (value === "NEED_PICKUP") {
      setHasOwnCar(false);
      setNeedsParking(false);
      setNeedsPickup(true);
      return;
    }

    setHasOwnCar(false);
    setNeedsParking(false);
    setNeedsPickup(false);
  }

  function handleOwnCarToggle() {
    const nextValue = !hasOwnCar;
    setHasOwnCar(nextValue);

    if (!nextValue) {
      setNeedsParking(false);

      if (transportOption === "OWN_CAR") {
        setTransportOption("NO_TRANSPORT_SUPPORT");
      }
    }
  }

  function handleParkingToggle() {
    if (!hasOwnCar) {
      return;
    }

    setNeedsParking((value) => !value);
  }

  function handlePickupToggle() {
    const nextValue = !needsPickup;
    setNeedsPickup(nextValue);

    if (nextValue) {
      setTransportOption("NEED_PICKUP");
      setHasOwnCar(false);
      setNeedsParking(false);
      return;
    }

    if (transportOption === "NEED_PICKUP") {
      setTransportOption("NO_TRANSPORT_SUPPORT");
    }
  }

  function goToNextStep() {
    if (currentStep === 1 && !selectedRoomId) {
      setLocalError("Please select a room before continuing.");
      return;
    }

    setLocalError("");
    setCurrentStep((value) => Math.min(value + 1, 4));
  }

  function goToPreviousStep() {
    setLocalError("");
    setCurrentStep((value) => Math.max(value - 1, 1));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="branchId" value={branch.id} />
          <input type="hidden" name="roomTypeId" value={roomType.id} />
          <input type="hidden" name="roomId" value={selectedRoomId} />
          <input type="hidden" name="checkInDate" value={checkInDate} />
          <input type="hidden" name="checkOutDate" value={checkOutDate} />
          <input type="hidden" name="isBookingForTwo" value={String(guestCount === 2)} />
          <input type="hidden" name="hasOwnCar" value={String(hasOwnCar)} />
          <input type="hidden" name="needsParking" value={String(needsParking)} />
          <input type="hidden" name="needsPickup" value={String(needsPickup)} />
          <input type="hidden" name="roomTypeCapacity" value={selectedRoom?.capacity ?? 0} />

          <section className="surface-card px-5 py-6 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Step {currentStep} of 4
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  {currentStep === 1
                    ? "Select your room"
                    : currentStep === 2
                      ? "Guest details"
                      : currentStep === 3
                        ? "Transport and arrival"
                        : "Review and confirm"}
                </h2>
              </div>
              <div className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
                {formatDateLabel(checkInDate)} to {formatDateLabel(checkOutDate)}
              </div>
            </div>

            {localError ? (
              <div className="mt-5 rounded-2xl border border-accent/20 bg-accent/8 px-4 py-3 text-sm text-accent">
                {localError}
              </div>
            ) : null}

            {state.message && !state.success ? (
              <div className="mt-5 rounded-2xl border border-accent/20 bg-accent/8 px-4 py-3 text-sm text-accent">
                {state.message}
              </div>
            ) : null}

            {currentStep === 1 ? (
              <div className="mt-6 space-y-4">
                <p className="text-sm leading-7 text-muted-foreground">
                  Choose one available room to continue with your booking.
                </p>
                <div className="grid gap-4">
                  {availableRooms.map((room) => {
                    const isSelected = room.id === selectedRoomId;

                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setSelectedRoomId(room.id)}
                        className={cn(
                          "rounded-[1.6rem] border px-4 py-5 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
                          isSelected
                            ? "border-primary bg-primary/6 shadow-[0_12px_35px_rgba(11,61,145,0.14)]"
                            : "border-border bg-white hover:border-primary/20",
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                              {room.branchName}
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-foreground">
                              Room {room.roomNumber}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {room.roomTypeName} | Capacity {room.capacity}
                            </p>
                          </div>
                          {isSelected ? (
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                              <CheckCircle2 className="h-5 w-5" />
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                          <p>Price per night: ${room.pricePerNight.toFixed(2)}</p>
                          <p>Estimated total: ${room.estimatedTotal.toFixed(2)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <ErrorText message={getError("roomId")} />
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <FieldGroup
                  label="First name"
                  name="firstName"
                  placeholder="Tafadzwa"
                  error={getError("firstName")}
                />
                <FieldGroup
                  label="Surname"
                  name="surname"
                  placeholder="Moyo"
                  error={getError("surname")}
                />
                <FieldGroup
                  label="ID or passport number"
                  name="idNumber"
                  placeholder="63-123456A11"
                  error={getError("idNumber")}
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  defaultValue=""
                  error={getError("gender")}
                  options={[
                    { value: "", label: "Select gender" },
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" },
                  ]}
                />
                <FieldGroup
                  label="Phone number"
                  name="phone"
                  type="tel"
                  placeholder="+263 78 000 0000"
                  error={getError("phone")}
                />
                <FieldGroup
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="guest@example.com"
                  error={getError("email")}
                />

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Booking type
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setGuestCount(1)}
                      className={cn(
                        "rounded-[1.4rem] border px-4 py-4 text-left",
                        guestCount === 1 ? "border-primary bg-primary/6" : "border-border bg-white",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Alone</p>
                          <p className="text-sm text-muted-foreground">1 guest</p>
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuestCount(2)}
                      className={cn(
                        "rounded-[1.4rem] border px-4 py-4 text-left",
                        guestCount === 2 ? "border-primary bg-primary/6" : "border-border bg-white",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">Two guests</p>
                          <p className="text-sm text-muted-foreground">2 guests</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  <input type="hidden" name="numberOfGuests" value={guestCount} />
                  <ErrorText message={getError("numberOfGuests") ?? getError("isBookingForTwo")} />
                </div>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FieldGroup
                    label="Expected arrival time"
                    name="expectedArrivalTime"
                    type="time"
                    error={getError("expectedArrivalTime")}
                  />
                  <SelectField
                    label="Transport option"
                    name="transportOption"
                    value={transportOption}
                    onChange={(event) =>
                      handleTransportOptionChange(
                        event.target.value as "OWN_CAR" | "NEED_PICKUP" | "NO_TRANSPORT_SUPPORT",
                      )
                    }
                    error={getError("transportOption")}
                    options={[
                      { value: "NO_TRANSPORT_SUPPORT", label: "No transport support" },
                      { value: "OWN_CAR", label: "Own car" },
                      { value: "NEED_PICKUP", label: "Need pickup" },
                    ]}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <ToggleCard
                    title="Has own car"
                    description="Needed for parking"
                    icon={<Car className="h-5 w-5 text-primary" />}
                    active={hasOwnCar}
                    onClick={handleOwnCarToggle}
                  />
                  <ToggleCard
                    title="Needs parking"
                    description="Only for own car"
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    active={needsParking}
                    disabled={!hasOwnCar}
                    onClick={handleParkingToggle}
                  />
                  <ToggleCard
                    title="Needs pickup"
                    description="Pickup support required"
                    icon={<MapPin className="h-5 w-5 text-primary" />}
                    active={needsPickup}
                    onClick={handlePickupToggle}
                  />
                </div>
                <ErrorText message={getError("hasOwnCar") || getError("needsParking") || getError("needsPickup")} />

                {needsPickup || transportOption === "NEED_PICKUP" ? (
                  <FieldGroup
                    label="Pickup point"
                    name="pickupPoint"
                    placeholder="Mutare rank, airport, or bus terminus"
                    error={getError("pickupPoint")}
                  />
                ) : (
                  <input type="hidden" name="pickupPoint" value="" />
                )}

                <div>
                  <label
                    htmlFor="specialRequests"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Special requests
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows={4}
                    placeholder="Optional notes about your stay"
                    className="w-full rounded-[1.4rem] border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                  <ErrorText message={getError("specialRequests")} />
                </div>
              </div>
            ) : null}

            {currentStep === 4 && bookingSummary ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-[1.6rem] border border-primary/12 bg-primary/6 px-4 py-4 text-sm text-foreground">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>
                      Your booking will be created as <strong>PENDING</strong> and the
                      payment status will remain <strong>UNPAID</strong> until the mock
                      EcoCash step is completed in the next module.
                    </p>
                  </div>
                </div>

                <BookingSummaryCard summary={bookingSummary} className="border-transparent shadow-none" />
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 1 || isPending}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button type="button" onClick={goToNextStep} className="w-full sm:w-auto">
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                  {isPending ? "Creating Booking..." : "Confirm Booking"}
                </Button>
              )}
            </div>
          </section>
        </form>

        <div className="space-y-4">
          {bookingSummary ? <BookingSummaryCard summary={bookingSummary} /> : null}
          <div className="rounded-[1.8rem] border border-border bg-white px-5 py-5 text-sm leading-7 text-muted-foreground shadow-[0_18px_45px_rgba(7,26,51,0.08)]">
            <p className="font-semibold text-foreground">Stay details</p>
            <p className="mt-3">Branch: {branch.name}</p>
            <p>Room type: {roomType.name}</p>
            <p>Check-in: {formatDateLabel(checkInDate)}</p>
            <p>Check-out: {formatDateLabel(checkOutDate)}</p>
            <p>
              Nights: {nights} | Guests: {guestCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-[1.4rem] border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      <ErrorText message={error} />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  defaultValue,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  defaultValue?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  const selectProps = value !== undefined ? { value } : { defaultValue };

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      <select
        id={name}
        name={name}
        {...selectProps}
        onChange={onChange}
        className="h-12 w-full rounded-[1.4rem] border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorText message={error} />
    </div>
  );
}

function ToggleCard({
  title,
  description,
  icon,
  active,
  disabled,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-[1.4rem] border px-4 py-4 text-left transition",
        active ? "border-primary bg-primary/6" : "border-border bg-white",
        disabled ? "cursor-not-allowed opacity-60" : "hover:border-primary/20",
      )}
    >
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-accent">{message}</p> : null;
}
