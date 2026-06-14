"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import type { RoomType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import type { RoomActionState } from "@/app/admin/(protected)/rooms/actions";
import type { RoomTypeFormValues } from "@/lib/validations/room";

type RoomTypeFormProps = {
  mode: "create" | "edit";
  roomType?: RoomType;
  submitAction: (
    state: RoomActionState<RoomTypeFormValues>,
    formData: FormData,
  ) => Promise<RoomActionState<RoomTypeFormValues>>;
};

const initialState: RoomActionState<RoomTypeFormValues> = {
  success: false,
  message: "",
};

export function RoomTypeForm({
  mode,
  roomType,
  submitAction,
}: RoomTypeFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);

  function getError(field: keyof RoomTypeFormValues) {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="surface-card space-y-6 px-6 py-8 sm:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Name" name="name" defaultValue={roomType?.name ?? ""} error={getError("name")} />
        <Field label="Slug" name="slug" defaultValue={roomType?.slug ?? ""} error={getError("slug")} />
      </div>
      <Field
        label="Description"
        name="description"
        defaultValue={roomType?.description ?? ""}
        error={getError("description")}
        as="textarea"
      />
      <div className="grid gap-6 md:grid-cols-3">
        <Field
          label="Base Price"
          name="basePrice"
          type="number"
          step="0.01"
          defaultValue={roomType?.basePrice.toString() ?? ""}
          error={getError("basePrice")}
        />
        <Field
          label="Capacity"
          name="capacity"
          type="number"
          defaultValue={roomType?.capacity.toString() ?? ""}
          error={getError("capacity")}
        />
        <Field
          label="Bed Type"
          name="bedType"
          defaultValue={roomType?.bedType ?? ""}
          error={getError("bedType")}
        />
      </div>
      <Field
        label="Amenities"
        name="amenities"
        defaultValue={roomType?.amenities.join(", ") ?? ""}
        error={getError("amenities")}
        helperText="Enter amenities as a comma-separated list."
      />
      <div className="rounded-3xl border border-border bg-muted px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Active status</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Only active room types appear on the public rooms page.
            </p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={roomType?.isActive ?? true}
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
          "Create Room Type"
        ) : (
          "Save Room Type"
        )}
      </Button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: keyof Omit<RoomTypeFormValues, "isActive" | "amenities"> | "amenities";
  defaultValue: string;
  error?: string;
  helperText?: string;
  type?: string;
  step?: string;
  as?: "input" | "textarea";
};

function Field({
  label,
  name,
  defaultValue,
  error,
  helperText,
  type = "text",
  step,
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
          rows={6}
          className={`${className} py-3`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          step={step}
          defaultValue={defaultValue}
          className={`${className} h-12`}
        />
      )}
      {helperText ? (
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{helperText}</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
    </div>
  );
}
