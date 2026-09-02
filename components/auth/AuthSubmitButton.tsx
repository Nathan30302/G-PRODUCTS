"use client";

export function AuthSubmitButton({
  pending,
  pendingLabel,
  label,
  disabled = false
}: {
  pending: boolean;
  pendingLabel: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="auth-submit mt-1 disabled:translate-y-0 disabled:opacity-60"
      aria-busy={pending}
    >
      {pending ? (
        <>
          <span className="auth-submit-spinner" aria-hidden />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
