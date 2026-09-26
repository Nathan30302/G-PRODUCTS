"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateCustomerAccountAction,
  type AccountFormState
} from "@/app/profile/account/actions";

function UpdateButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-brand px-5 py-2.5 text-sm disabled:opacity-60"
    >
      {pending ? "Updating…" : "Update"}
    </button>
  );
}

export function AccountSettingsForm({
  firstName,
  lastName,
  phone,
  email,
  address,
  offersOptIn
}: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  offersOptIn: boolean;
}) {
  const [state, action] = useActionState<
    AccountFormState | undefined,
    FormData
  >(updateCustomerAccountAction, undefined);

  return (
    <form
      action={action}
      className="mt-6 grid gap-4 sm:grid-cols-2"
      key={`${firstName}|${lastName}|${phone}|${email}|${address}|${offersOptIn}`}
    >
      <label className="block">
        <span className="field-label">First name</span>
        <input
          name="firstName"
          defaultValue={firstName}
          required
          autoComplete="given-name"
          className="field mt-2"
        />
      </label>
      <label className="block">
        <span className="field-label">Last name</span>
        <input
          name="lastName"
          defaultValue={lastName}
          required
          autoComplete="family-name"
          className="field mt-2"
        />
      </label>
      <label className="block">
        <span className="field-label">Phone number</span>
        <input
          name="phone"
          defaultValue={phone}
          required
          inputMode="tel"
          autoComplete="tel"
          className="field mt-2"
        />
      </label>
      <label className="block">
        <span className="field-label">Email address</span>
        <input
          name="email"
          type="email"
          defaultValue={email}
          required
          autoComplete="email"
          className="field mt-2"
        />
      </label>
      <label className="flex items-center justify-between gap-4 rounded-2xl border border-gp-border bg-gp-muted/60 px-4 py-3 sm:col-span-2">
        <span>
          <span className="block text-sm font-semibold text-gp-text">
            Latest offers
          </span>
          <span className="mt-0.5 block text-xs text-gp-text-muted">
            Turn this on if you want news and deals from G-Products.
          </span>
        </span>
        <input
          type="checkbox"
          name="offersOptIn"
          defaultChecked={offersOptIn}
          className="h-5 w-5 shrink-0 accent-ink-800"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="field-label">Address</span>
        <textarea
          name="address"
          defaultValue={address}
          rows={3}
          className="field mt-2 min-h-[5rem] resize-y"
          placeholder="Room, hostel, or home address"
        />
      </label>

      {state?.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-2xl border border-brand/40 bg-brand/15 px-4 py-3 text-sm font-medium text-ink-900 sm:col-span-2">
          Account updated.
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <UpdateButton />
      </div>
    </form>
  );
}
