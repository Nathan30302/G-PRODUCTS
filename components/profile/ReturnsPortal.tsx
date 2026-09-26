"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  submitAftercareAction,
  type AftercareFormState
} from "@/app/profile/account/actions";

function PortalButtons() {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <button
        type="submit"
        name="intent"
        value="start"
        disabled={pending}
        className="btn-brand px-5 py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Sending…" : "Get started"}
      </button>
      <button
        type="submit"
        name="intent"
        value="gift"
        disabled={pending}
        className="btn-ghost px-5 py-2.5 text-sm disabled:opacity-60"
      >
        Return a gift
      </button>
      <Link href="/search" className="btn-ghost px-5 py-2.5 text-sm">
        Continue with the shop
      </Link>
    </div>
  );
}

export function ReturnsPortal({ contact }: { contact: string }) {
  const [state, action] = useActionState<
    AftercareFormState | undefined,
    FormData
  >(submitAftercareAction, undefined);

  return (
    <form action={action} className="mt-5 space-y-4">
      <p className="text-sm leading-relaxed text-gp-text-muted">
        This portal handles returns, exchanges, and warranty claims for devices
        bought directly from G-Products.
      </p>
      <label className="block">
        <span className="field-label">What do you need?</span>
        <select name="kind" defaultValue="return" className="field mt-2">
          <option value="return">Return</option>
          <option value="exchange">Exchange</option>
          <option value="warranty">Warranty claim</option>
        </select>
      </label>
      <label className="block">
        <span className="field-label">Order number</span>
        <input
          name="orderRef"
          required
          className="field mt-2"
          placeholder="GP-…"
          autoComplete="off"
        />
      </label>
      <label className="block">
        <span className="field-label">Email or phone number</span>
        <input
          name="contact"
          required
          defaultValue={contact}
          className="field mt-2"
          placeholder="Email or phone on the order"
        />
      </label>

      {state?.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state?.ok && state.ref ? (
        <p className="rounded-2xl border border-brand/40 bg-brand/15 px-4 py-3 text-sm font-medium text-ink-900">
          Request {state.ref} is with the shop. We will follow it up on this
          order.
        </p>
      ) : null}

      <PortalButtons />
    </form>
  );
}
