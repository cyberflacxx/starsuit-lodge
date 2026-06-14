"use client";

import Image from "next/image";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle } from "lucide-react";
import type { AdminRole, BranchSummary } from "@/types";
import { Button } from "@/components/ui/button";
import type { GalleryImageFormValues } from "@/lib/validations/content";

type ContentActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

type GalleryImageFormProps = {
  mode: "create" | "edit";
  image?: {
    id: string;
    title: string;
    altText: string;
    imageUrl: string;
    branchId: string | null;
    sortOrder: number;
    isFeatured: boolean;
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

export function GalleryImageForm({
  mode,
  image,
  branches,
  adminRole,
  assignedBranchId,
  submitAction,
}: GalleryImageFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitAction, initialState);
  const isBranchLocked = adminRole === "BRANCH_ADMIN" && Boolean(assignedBranchId);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/content");
      router.refresh();
    }
  }, [router, state.success]);

  function getError(field: keyof GalleryImageFormValues | "id") {
    return state.errors?.[field]?.[0];
  }

  return (
    <form action={formAction} className="surface-card space-y-6 px-6 py-8 sm:px-8">
      {mode === "edit" && image ? <input type="hidden" name="id" value={image.id} /> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={image?.title ?? ""} error={getError("title")} />
        <Field
          label="Alt text"
          name="altText"
          defaultValue={image?.altText ?? ""}
          error={getError("altText")}
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="mb-2 block text-sm font-semibold text-foreground">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          defaultValue={image?.imageUrl ?? ""}
          placeholder="https://..."
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          URL entry is supported now. Supabase Storage upload is prepared as a safe placeholder for a later module.
        </p>
        <ErrorText message={getError("imageUrl")} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
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
              defaultValue={image?.branchId ?? ""}
              className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
            >
              <option value="">Global image</option>
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
          <label htmlFor="sortOrder" className="mb-2 block text-sm font-semibold text-foreground">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={image?.sortOrder ?? 0}
            className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <ErrorText message={getError("sortOrder")} />
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-border bg-muted px-5 py-5">
          <label className="inline-flex items-center gap-3 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={image?.isFeatured ?? false}
              className="h-4 w-4 accent-primary"
            />
            Featured
          </label>
          <label className="inline-flex items-center gap-3 text-sm font-semibold text-foreground">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={image?.isActive ?? true}
              className="h-4 w-4 accent-primary"
            />
            Active
          </label>
        </div>
      </div>

      {image?.imageUrl ? (
        <div className="rounded-3xl border border-border bg-muted px-5 py-5">
          <div className="flex items-center gap-3">
            <ImagePlus className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold text-foreground">Current preview</p>
          </div>
          <Image
            src={image.imageUrl}
            alt={image.altText}
            width={640}
            height={384}
            className="mt-4 h-48 w-full rounded-2xl object-cover"
            unoptimized
          />
        </div>
      ) : null}

      {state.message ? <FeedbackBanner success={state.success} message={state.message} /> : null}

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </>
        ) : mode === "create" ? (
          "Add Gallery Image"
        ) : (
          "Save Gallery Image"
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
  name: "title" | "altText";
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
