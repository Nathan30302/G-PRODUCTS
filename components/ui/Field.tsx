import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export function FieldLabel({
  children,
  htmlFor,
  className = ""
}: {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`field-label ${className}`.trim()}>
      {children}
    </label>
  );
}

export const FieldInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function FieldInput({ className = "", ...props }, ref) {
  return <input ref={ref} className={`field ${className}`.trim()} {...props} />;
});

export const FieldTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function FieldTextarea({ className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`field min-h-[7rem] resize-y ${className}`.trim()}
      {...props}
    />
  );
});

export function FieldGroup({
  label,
  htmlFor,
  hint,
  error,
  children
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      <div className="mt-1">{children}</div>
      {error ? (
        <p className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-white/40">{hint}</p>
      ) : null}
    </div>
  );
}
