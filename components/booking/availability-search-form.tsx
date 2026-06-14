"use client";

import { useActionState } from "react";
import type { AvailabilitySearchState, BranchSummary, RoomTypeSummary } from "@/types";
import { AvailabilityResultCard } from "@/components/booking/availability-result-card";
import { Button } from "@/components/ui/button";

type AvailabilitySearchFormProps = {
  branches: BranchSummary[];
  roomTypes: RoomTypeSummary[];
  submitAction: (
    state: AvailabilitySearchState,
    formData: FormData,
  ) => Promise<AvailabilitySearchState>;
  lockedBranchId?: string;
  showContinueButton?: boolean;
};

const initialState: AvailabilitySearchState = {
  success: false,
  message: "",
};

export function AvailabilitySearchForm({
  branches,
  roomTypes,
  submitAction,
  lockedBranchId,
  showContinueButton = true,
}: AvailabilitySearchFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const today = new Date().toISOString().slice(0, 10);
  const lockedBranch = branches.find((branch) => branch.id === lockedBranchId);

  function getError(field: keyof NonNullable<AvailabilitySearchState["errors"]>) {
    return state.errors?.[field]?.[0];
  }

  return (
    <div className="space-y-6">
      <form action={formAction} className="surface-card space-y-6 px-6 py-8 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <label htmlFor="branchId" className="mb-2 block text-sm font-semibold text-foreground">
              Branch
            </label>
            {lockedBranchId && lockedBranch ? (
              <>
                <input type="hidden" name="branchId" value={lockedBranchId} />
                <input
                  id="branchId"
                  readOnly
                  value={lockedBranch.name}
                  className="h-12 w-full cursor-not-allowed rounded-2xl border border-border bg-muted px-4 text-sm text-foreground"
                />
              </>
            ) : (
              <select
                id="branchId"
                name="branchId"
                defaultValue=""
                className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              >
                <option value="">Select branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            )}
            <ErrorText message={getError("branchId")} />
          </div>

          <div className="xl:col-span-2">
            <label htmlFor="roomTypeId" className="mb-2 block text-sm font-semibold text-foreground">
              Room Type
            </label>
            <select
              id="roomTypeId"
              name="roomTypeId"
              defaultValue=""
              className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="">Any Room Type</option>
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </select>
            <ErrorText message={getError("roomTypeId")} />
          </div>

          <div>
            <label htmlFor="numberOfGuests" className="mb-2 block text-sm font-semibold text-foreground">
              Guests
            </label>
            <input
              id="numberOfGuests"
              name="numberOfGuests"
              type="number"
              min={1}
              max={10}
              defaultValue={1}
              className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <ErrorText message={getError("numberOfGuests")} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="checkInDate" className="mb-2 block text-sm font-semibold text-foreground">
              Check-in Date
            </label>
            <input
              id="checkInDate"
              name="checkInDate"
              type="date"
              min={today}
              className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <ErrorText message={getError("checkInDate")} />
          </div>
          <div>
            <label htmlFor="checkOutDate" className="mb-2 block text-sm font-semibold text-foreground">
              Check-out Date
            </label>
            <input
              id="checkOutDate"
              name="checkOutDate"
              type="date"
              min={today}
              className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <ErrorText message={getError("checkOutDate")} />
          </div>
        </div>

        {state.message && !state.success ? (
          <div className="rounded-2xl border border-accent/20 bg-accent/8 px-4 py-3 text-sm text-accent">
            {state.message}
          </div>
        ) : null}

        <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Checking Availability..." : "Check Availability"}
        </Button>
      </form>

      {state.data ? (
        <AvailabilityResultCard
          summary={state.data}
          showContinueButton={showContinueButton}
        />
      ) : null}
    </div>
  );
}

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-accent">{message}</p> : null;
}
