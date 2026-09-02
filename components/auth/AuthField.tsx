"use client";

import { type InputHTMLAttributes, type ReactNode, useId } from "react";
import { Icon } from "@/components/Icons";

type IconName = Parameters<typeof Icon>[0]["name"];

export function AuthField({
  label,
  hint,
  error,
  icon,
  trailing,
  labelExtra,
  className = "",
  inputClassName = "",
  id: idProp,
  ...inputProps
}: {
  label: string;
  hint?: string;
  error?: string | null;
  icon?: IconName;
  trailing?: ReactNode;
  labelExtra?: ReactNode;
  className?: string;
  inputClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className="block" htmlFor={id}>
      <span className="auth-field-label">
        {label}
        {labelExtra}
      </span>
      <div
        className={`auth-input-wrap ${error ? "auth-input-wrap-error" : ""} ${className}`.trim()}
      >
        {icon ? (
          <span className="auth-input-icon" aria-hidden>
            <Icon name={icon} className="h-[1.05rem] w-[1.05rem]" />
          </span>
        ) : null}
        <input
          id={id}
          className={`auth-input ${inputClassName}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
        {trailing}
      </div>
      {error ? (
        <p id={errorId} className="auth-field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="auth-field-hint">
          {hint}
        </p>
      ) : null}
    </label>
  );
}
