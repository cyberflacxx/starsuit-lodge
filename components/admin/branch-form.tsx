"use client";

import { useActionState } from "react";
import { LoaderCircle } from "lucide-react";
import type { Branch } from "@prisma/client";
import { Button } from "@/components/ui/button";
import type { BranchFormState } from "@/app/admin/(protected)/branches/actions";
import type { BranchFormValues } from "@/lib/validations/branch";

type BranchFormProps = {
  branch: Branch;
  submitAction: (
    state: BranchFormState,
    formData: FormData,
  ) => Promise<BranchFormState>;
  canEditSlug: boolean;
};

const initialState: BranchFormState = {
  success: false,
  message: "",
};

export function BranchForm({
  branch,
  submitAction,
  canEditSlug,
}: BranchFormProps) {
  const [state, formAction, isPending] = useActionState(submitAction, initialState);

  function getError(field: keyof BranchFormValues) {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="surface-card space-y-6 px-6 py-8 sm:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Name" name="name" defaultValue={branch.name} error={getError("name")} />
        <Field
          label="Slug"
          name="slug"
          defaultValue={branch.slug}
          error={getError("slug")}
          readOnly={!canEditSlug}
          helperText={
            canEditSlug
              ? "Use lowercase letters, numbers, and hyphens only."
              : "Branch admins cannot change the slug to avoid breaking public links."
          }
        />
      </div>

      <Field
        label="Description"
        name="description"
        defaultValue={branch.description}
        error={getError("description")}
        as="textarea"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Address"
          name="address"
          defaultValue={branch.address}
          error={getError("address")}
        />
        <Field label="City" name="city" defaultValue={branch.city} error={getError("city")} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Phone"
          name="phone"
          defaultValue={branch.phone}
          error={getError("phone")}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={branch.email}
          error={getError("email")}
        />
      </div>

      <Field
        label="Map URL"
        name="mapUrl"
        type="url"
        defaultValue={branch.mapUrl}
        error={getError("mapUrl")}
        helperText="Optional. Paste a full map URL if you want the public website map link to work."
      />

      <div className="rounded-3xl border border-border bg-muted px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Active status</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Active branches appear on public pages and remain bookable in future modules.
            </p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={branch.isActive}
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes
            </>
          ) : (
            "Save Branch Details"
          )}
        </Button>
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: keyof BranchFormValues;
  defaultValue: string;
  error?: string;
  type?: string;
  readOnly?: boolean;
  helperText?: string;
  as?: "input" | "textarea";
};

function Field({
  label,
  name,
  defaultValue,
  error,
  type = "text",
  readOnly = false,
  helperText,
  as = "input",
}: FieldProps) {
  const baseClassName =
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
          readOnly={readOnly}
          className={`${baseClassName} py-3 ${readOnly ? "cursor-not-allowed bg-muted" : ""}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          readOnly={readOnly}
          className={`${baseClassName} h-12 ${readOnly ? "cursor-not-allowed bg-muted" : ""}`}
        />
      )}
      {helperText ? (
        <p className="mt-2 text-xs leading-6 text-muted-foreground">{helperText}</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
    </div>
  );
}
