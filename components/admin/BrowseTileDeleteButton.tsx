"use client";

import { useActionState } from "react";
import {
  deleteBrowseTile,
  type BrowseTileActionState
} from "@/app/admin/(dashboard)/browse-tiles/actions";

export function BrowseTileDeleteButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState<
    BrowseTileActionState | undefined,
    FormData
  >(deleteBrowseTile, undefined);

  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
      >
        {pending ? "Removing…" : "Remove"}
      </button>
      {state?.error ? (
        <p className="mt-1 text-xs text-red-300">{state.error}</p>
      ) : null}
    </form>
  );
}
