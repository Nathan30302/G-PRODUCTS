"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateCustomerLocationAction,
  type LocationFormState
} from "@/app/profile/account/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-brand mt-2 px-5 py-2.5 text-sm disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save location"}
    </button>
  );
}

export function LocationForm({
  locationLabel,
  defaultLocation
}: {
  locationLabel: string;
  defaultLocation: string;
}) {
  const [state, action] = useActionState<
    LocationFormState | undefined,
    FormData
  >(updateCustomerLocationAction, undefined);

  return (
    <form action={action} className="mt-4 space-y-4">
      <label className="block">
        <span className="field-label">Location label</span>
        <input
          name="locationLabel"
          defaultValue={locationLabel}
          className="field mt-2"
          placeholder="e.g. Campus room, Home"
        />
        <span className="mt-1.5 block text-[11px] text-gp-text-subtle">
          Helps you pick the right spot at checkout.
        </span>
      </label>

      <label className="block">
        <span className="field-label">Delivery address / room</span>
        <textarea
          name="defaultLocation"
          defaultValue={defaultLocation}
          required
          rows={3}
          className="field mt-2 min-h-[5rem] resize-y"
          placeholder="e.g. Kalingalinga Block A Room 12"
        />
      </label>

      {state?.error ? (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p className="rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm text-accent">
          Saved — checkout will use this address automatically.
        </p>
      ) : null}

      <SaveButton />
    </form>
  );
}
