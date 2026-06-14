"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import type { Room } from "@prisma/client";
import { Button } from "@/components/ui/button";
import type { RoomActionState } from "@/app/admin/(protected)/rooms/actions";
import type { MaintenanceBlockFormValues } from "@/lib/validations/room";

type RoomOption = Pick<Room, "id" | "roomNumber"> & {
  branchName: string;
};

type MaintenanceBlockFormProps = {
  rooms: RoomOption[];
  submitAction: (
    state: RoomActionState<MaintenanceBlockFormValues>,
    formData: FormData,
  ) => Promise<RoomActionState<MaintenanceBlockFormValues>>;
};

const initialState: RoomActionState<MaintenanceBlockFormValues> = {
  success: false,
  message: "",
};

export function MaintenanceBlockForm({
  rooms,
  submitAction,
}: MaintenanceBlockFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const today = new Date().toISOString().slice(0, 10);

  function getError(field: keyof MaintenanceBlockFormValues) {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="surface-card space-y-6 px-6 py-8 sm:px-8">
      <div>
        <label htmlFor="roomId" className="mb-2 block text-sm font-semibold text-foreground">
          Room
        </label>
        <select
          id="roomId"
          name="roomId"
          defaultValue=""
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        >
          <option value="">Select room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.branchName} - {room.roomNumber}
            </option>
          ))}
        </select>
        <ErrorText message={getError("roomId")} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="mb-2 block text-sm font-semibold text-foreground">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            min={today}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <ErrorText message={getError("startDate")} />
        </div>
        <div>
          <label htmlFor="endDate" className="mb-2 block text-sm font-semibold text-foreground">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            min={today}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <ErrorText message={getError("endDate")} />
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="mb-2 block text-sm font-semibold text-foreground">
          Reason
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={5}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
        <ErrorText message={getError("reason")} />
      </div>

      {state.message ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.success
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
              : "border border-accent/20 bg-accent/8 text-accent"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </>
        ) : (
          "Create Maintenance Block"
        )}
      </Button>
    </form>
  );
}

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-accent">{message}</p> : null;
}
