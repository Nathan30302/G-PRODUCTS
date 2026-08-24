"use client";

import { useActionState } from "react";
import {
  createTeamMember,
  type TeamActionState
} from "@/app/admin/(dashboard)/shop-team/actions";

export function ShopTeamMemberForm() {
  const [state, action, pending] = useActionState<
    TeamActionState | undefined,
    FormData
  >(createTeamMember, undefined);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm font-semibold text-white/70">Name</span>
        <input
          name="name"
          required
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
          placeholder="Gift Mbumwae"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-white/70">Title / role</span>
        <input
          name="title"
          required
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
          placeholder="Owner · Store lead"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-white/70">Sort order</span>
        <input
          name="sortOrder"
          type="number"
          defaultValue={0}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand"
        />
      </label>
      {state?.error ? (
        <p className="text-sm text-red-300">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="text-sm text-accent">{state.success}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="btn-brand px-5 py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Saving…" : "Add member"}
      </button>
    </form>
  );
}
