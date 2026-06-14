"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import type { ContentStatus } from "@prisma/client";
import type { BranchSummary, AdminRole } from "@/types";
import { Button } from "@/components/ui/button";
import type { ContentBlockFormValues } from "@/lib/validations/content";

type ContentActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

type ContentBlockFormProps = {
  mode: "create" | "edit";
  block?: {
    id: string;
    key: string;
    title: string;
    body: string;
    branchId: string | null;
    status: ContentStatus;
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

export function ContentBlockForm({
  mode,
  block,
  branches,
  adminRole,
  assignedBranchId,
  submitAction,
}: ContentBlockFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const isBranchLocked = adminRole === "BRANCH_ADMIN" && Boolean(assignedBranchId);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/content");
      router.refresh();
    }
  }, [router, state.success]);

  function getError(field: keyof ContentBlockFormValues | "id") {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="surface-card space-y-6 px-6 py-8 sm:px-8">
      {mode === "edit" && block ? <input type="hidden" name="id" value={block.id} /> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Key" name="key" defaultValue={block?.key ?? ""} error={getError("key")} />
        <Field label="Title" name="title" defaultValue={block?.title ?? ""} error={getError("title")} />
      </div>

      <div>
        <label htmlFor="body" className="mb-2 block text-sm font-semibold text-foreground">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={8}
          defaultValue={block?.body ?? ""}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
        <ErrorText message={getError("body")} />
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
              defaultValue={block?.branchId ?? ""}
              className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
            >
              <option value="">Global content</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          )}
          {adminRole === "BRANCH_ADMIN" ? (
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Branch admins can only create and edit content for their assigned branch.
            </p>
          ) : null}
          <ErrorText message={getError("branchId")} />
        </div>

        <div>
          <label htmlFor="status" className="mb-2 block text-sm font-semibold text-foreground">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={block?.status ?? "DRAFT"}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
          <ErrorText message={getError("status")} />
        </div>
      </div>

      {state.message ? (
        <FeedbackBanner success={state.success} message={state.message} />
      ) : null}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </>
        ) : mode === "create" ? (
          "Create Content Block"
        ) : (
          "Save Content Block"
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
  name: "key" | "title";
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
