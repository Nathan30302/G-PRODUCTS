"use client";

import { useActionState } from "react";
import {
  deleteTeamMember,
  toggleTeamPublished,
  type TeamActionState
} from "@/app/admin/(dashboard)/shop-team/actions";

type Member = {
  id: string;
  name: string;
  title: string;
  sortOrder: number;
  published: boolean;
};

export function ShopTeamMemberRow({ member }: { member: Member }) {
  const [toggleState, toggleAction, togglePending] = useActionState<
    TeamActionState | undefined,
    FormData
  >(toggleTeamPublished, undefined);
  const [deleteState, deleteAction, deletePending] = useActionState<
    TeamActionState | undefined,
    FormData
  >(deleteTeamMember, undefined);

  const initials = member.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-brand/10 text-xs font-black text-brand">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white">{member.name}</p>
        <p className="text-sm text-white/50">{member.title}</p>
        <p className="mt-1 text-[11px] text-white/35">
          Order {member.sortOrder} ·{" "}
          {member.published ? "Published" : "Hidden"}
        </p>
        {toggleState?.error || deleteState?.error ? (
          <p className="mt-1 text-xs text-red-300">
            {toggleState?.error ?? deleteState?.error}
          </p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <form action={toggleAction}>
          <input type="hidden" name="id" value={member.id} />
          <input
            type="hidden"
            name="published"
            value={member.published ? "0" : "1"}
          />
          <button
            type="submit"
            disabled={togglePending}
            className="rounded-pill border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 hover:border-brand/40 hover:text-brand disabled:opacity-50"
          >
            {member.published ? "Hide" : "Publish"}
          </button>
        </form>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={member.id} />
          <button
            type="submit"
            disabled={deletePending}
            className="rounded-pill px-3 py-1.5 text-xs font-semibold text-red-400/80 hover:text-red-300 disabled:opacity-50"
          >
            Remove
          </button>
        </form>
      </div>
    </li>
  );
}
