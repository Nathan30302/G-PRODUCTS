"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  updateOrderStatus,
  type OrderStatusState
} from "@/app/admin/(dashboard)/orders/actions";
import {
  labelForOrderStatus,
  orderStatusLabels,
  type OrderStatusKey
} from "@/lib/commerce-hooks";

const STATUSES = Object.keys(orderStatusLabels) as OrderStatusKey[];

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
  const [selected, setSelected] = useState(currentStatus);
  const preview = labelForOrderStatus(selected);

  useEffect(() => {
    setSelected(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="id" value={orderId} />
      <p className="text-xs leading-relaxed text-gp-text-muted">
        Customers will see{" "}
        <span className="font-semibold text-gp-text">{preview.label}</span>
        {preview.hint ? ` — ${preview.hint}` : ""}. Saving updates their track page.
      </p>
      <select
        key={currentStatus}
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full rounded-xl border border-gp-border bg-gp-surface px-4 py-3 text-sm text-gp-text outline-none focus:border-brand/70 focus:shadow-[0_0_0_4px_rgba(229,243,79,0.28)]"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {orderStatusLabels[s].label}
          </option>
        ))}
      </select>

      {state?.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-ink-850">
          Saved. The customer’s track page now shows this status.
        </p>
      ) : null}

      <SaveButton />
    </form>
  );
}
