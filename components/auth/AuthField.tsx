"use client";

import { type InputHTMLAttributes, type ReactNode } from "react";
import { Icon } from "@/components/Icons";

type IconName = Parameters<typeof Icon>[0]["name"];

export function AuthField({
  label,
  hint,
  icon,
  trailing,
  labelExtra,
  className = "",
  inputClassName = "",
  ...inputProps
}: {
  label: string;
  hint?: string;
  icon?: IconName;
  trailing?: ReactNode;
  labelExtra?: ReactNode;
  className?: string;
  inputClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="auth-field-label">
        {label}
        {labelExtra}
      </span>
      <div className={`auth-input-wrap ${className}`.trim()}>
        {icon ? (
          <span className="auth-input-icon" aria-hidden>
            <Icon name={icon} className="h-[1.05rem] w-[1.05rem]" />
          </span>
        ) : null}
        <input
          className={`auth-input ${inputClassName}`.trim()}
          {...inputProps}
        />
        {trailing}
      </div>
      {hint ? <p className="auth-field-hint">{hint}</p> : null}
    </label>
  );
}
