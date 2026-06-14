"use client";

import { useActionState } from "react";
import { RoomStatus, UserRole, type Branch, type Room, type RoomType } from "@prisma/client";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomActionState } from "@/app/admin/(protected)/rooms/actions";
import type { RoomFormValues } from "@/lib/validations/room";

type RoomFormProps = {
  mode: "create" | "edit";
  room?: Room;
  branches: Branch[];
  roomTypes: RoomType[];
  adminRole: UserRole;
  assignedBranchId: string | null;
  submitAction: (
    state: RoomActionState<RoomFormValues>,
    formData: FormData,
  ) => Promise<RoomActionState<RoomFormValues>>;
};

const initialState: RoomActionState<RoomFormValues> = {
  success: false,
  message: "",
};

export function RoomForm({
  mode,
  room,
  branches,
  roomTypes,
  adminRole,
  assignedBranchId,
  submitAction,
}: RoomFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const isBranchLocked = adminRole === UserRole.BRANCH_ADMIN && Boolean(assignedBranchId);

  function getError(field: keyof RoomFormValues) {
    return state.errors?.[field]?.[0];
  }

  const selectedBranchId = room?.branchId ?? assignedBranchId ?? "";

  return (
    <form action={formAction} className="surface-card space-y-6 px-6 py-8 sm:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="branchId" className="mb-2 block text-sm font-semibold text-foreground">
            Branch
          </label>
          {isBranchLocked ? (
            <>
              <input type="hidden" name="branchId" value={selectedBranchId} />
              <input
                id="branchId"
                value={branches.find((branch) => branch.id === selectedBranchId)?.name ?? ""}
                readOnly
                className="h-12 w-full cursor-not-allowed rounded-2xl border border-border bg-muted px-4 text-sm text-foreground"
              />
            </>
          ) : (
            <select
              id="branchId"
              name="branchId"
              defaultValue={selectedBranchId}
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

        <div>
          <label htmlFor="roomTypeId" className="mb-2 block text-sm font-semibold text-foreground">
            Room Type
          </label>
          <select
            id="roomTypeId"
            name="roomTypeId"
            defaultValue={room?.roomTypeId ?? ""}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            <option value="">Select room type</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.name}
              </option>
            ))}
          </select>
          <ErrorText message={getError("roomTypeId")} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Room Number" name="roomNumber" defaultValue={room?.roomNumber ?? ""} error={getError("roomNumber")} />
        <Field label="Floor" name="floor" type="number" defaultValue={room?.floor?.toString() ?? ""} error={getError("floor")} />
        <div>
          <label htmlFor="status" className="mb-2 block text-sm font-semibold text-foreground">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={room?.status ?? RoomStatus.AVAILABLE}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            {Object.values(RoomStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ErrorText message={getError("status")} />
        </div>
      </div>

      <Field
        label="Notes"
        name="notes"
        defaultValue={room?.notes ?? ""}
        error={getError("notes")}
        as="textarea"
      />

      <div className="rounded-3xl border border-border bg-muted px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Active status</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Inactive rooms stay hidden from future operational flows while preserving data.
            </p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={room?.isActive ?? true}
              className="h-4 w-4 accent-primary"
            />
            Active
          </label>
        </div>
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
        ) : mode === "create" ? (
          "Create Room"
        ) : (
          "Save Room"
        )}
      </Button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: keyof Pick<RoomFormValues, "roomNumber" | "floor" | "notes">;
  defaultValue: string;
  error?: string;
  type?: string;
  as?: "input" | "textarea";
};

function Field({
  label,
  name,
  defaultValue,
  error,
  type = "text",
  as = "input",
}: FieldProps) {
  const className =
    "w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          rows={5}
          className={`${className} py-3`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          className={`${className} h-12`}
        />
      )}
      <ErrorText message={error} />
    </div>
  );
}

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-accent">{message}</p> : null;
}
