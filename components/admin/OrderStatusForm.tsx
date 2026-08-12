"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  updateOrderStatus,
  type OrderStatusState
} from "@/app/admin/(dashboard)/orders/actions";

const STATUSES = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED"
] as const;

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-pill bg-brand px-4 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Saving…" : "Save status"}
    </button>
  );
}

export function OrderStatusForm({
  orderId,
  currentStatus
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [state, action] = useActionState<OrderStatusState | undefined, FormData>(
    updateOrderStatus,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="id" value={orderId} />
      <select
        key={currentStatus}
        name="status"
        defaultValue={currentStatus}
        className="w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {state?.error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          {state.success}
        </p>
      ) : null}

      <SaveButton />
    </form>
  );
}
