"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  updateStaffTitle,
  type StaffState
} from "@/app/admin/(dashboard)/staff/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-brand px-2.5 py-1 text-[11px] font-bold text-ink-950 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function StaffRoleCell({
  userId,
  role,
  staffTitle
}: {
  userId: string;
  role: "OWNER" | "STAFF";
  staffTitle: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [state, action] = useActionState<StaffState | undefined, FormData>(
    updateStaffTitle,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      setEditing(false);
      router.refresh();
    }
  }, [state?.success, router]);

  if (role === "OWNER") {
    return (
      <span className="rounded-pill border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
        Owner
      </span>
    );
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-pill border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/65">
          {staffTitle?.trim() || "Staff"}
        </span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-[11px] font-semibold text-brand hover:underline"
        >
          Edit role
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="flex min-w-[12rem] flex-col gap-1.5">
      <input type="hidden" name="id" value={userId} />
      <input
        name="staffTitle"
        defaultValue={staffTitle ?? ""}
        placeholder="e.g. Orders & uploads"
        className="w-full rounded-lg border border-white/10 bg-ink-900 px-2.5 py-1.5 text-xs text-white outline-none focus:border-brand"
        required
        autoFocus
      />
      <div className="flex items-center gap-2">
        <SaveButton />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-[11px] text-white/40 hover:text-white"
        >
          Cancel
        </button>
      </div>
      {state?.error ? (
        <p className="text-[11px] text-red-400">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="text-[11px] text-accent">{state.success}</p>
      ) : null}
    </form>
  );
}
