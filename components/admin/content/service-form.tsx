"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import type { AdminRole, BranchSummary } from "@/types";
import { Button } from "@/components/ui/button";
import type { ServiceFormValues } from "@/lib/validations/content";

type ContentActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

type ServiceFormProps = {
  mode: "create" | "edit";
  service?: {
    id: string;
    title: string;
    description: string;
    iconName: string | null;
    branchId: string | null;
    isActive: boolean;
  };
  branches: BranchSummary[];
  adminRole: AdminRole;
  assignedBranchId: string | null;
  submitAction: (
    state: ContentActionState,
    formData: FormData,
  ) => Promise<ContentActionState>;
};

const initialState: ContentActionState = {
  success: false,
  message: "",
};

export function ServiceForm({
  mode,
  service,
  branches,
  adminRole,
  assignedBranchId,
  submitAction,
}: ServiceFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const isBranchLocked = adminRole === "BRANCH_ADMIN" && Boolean(assignedBranchId);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/content");
      router.refresh();
    }
  }, [router, state.success]);

  function getError(field: keyof ServiceFormValues | "id") {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="surface-card space-y-6 px-6 py-8 sm:px-8">
      {mode === "edit" && service ? <input type="hidden" name="id" value={service.id} /> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={service?.title ?? ""} error={getError("title")} />
        <Field
          label="Icon name"
          name="iconName"
          defaultValue={service?.iconName ?? ""}
          error={getError("iconName")}
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-foreground">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={service?.description ?? ""}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
        <ErrorText message={getError("description")} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="branchId" className="mb-2 block text-sm font-semibold text-foreground">
            Branch
          </label>
          {isBranchLocked ? (
            <>
              <input type="hidden" name="branchId" value={assignedBranchId ?? ""} />
              <input
                id="branchId"
                value={branches.find((branch) => branch.id === assignedBranchId)?.name ?? ""}
                readOnly
                className="h-12 w-full cursor-not-allowed rounded-2xl border border-border bg-muted px-4 text-sm text-foreground"
              />
            </>
          ) : (
            <select
              id="branchId"
              name="branchId"
              defaultValue={service?.branchId ?? ""}
              className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
            >
              <option value="">Global service</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          )}
          <ErrorText message={getError("branchId")} />
        </div>

        <div className="rounded-3xl border border-border bg-muted px-5 py-5">
          <label className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={service?.isActive ?? true}
              className="h-4 w-4 accent-primary"
            />
            Active
          </label>
        </div>
      </div>

      {state.message ? <FeedbackBanner success={state.success} message={state.message} /> : null}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </>
        ) : mode === "create" ? (
          "Create Service"
        ) : (
          "Save Service"
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
}: {
  label: string;
  name: "title" | "iconName";
  defaultValue: string;
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
        defaultValue={defaultValue}
        className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      <ErrorText message={error} />
    </div>
  );
}

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-accent">{message}</p> : null;
}

function FeedbackBanner({ success, message }: { success: boolean; message: string }) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm ${
        success
          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
          : "border border-accent/20 bg-accent/8 text-accent"
      }`}
    >
      {message}
    </div>
  );
}
