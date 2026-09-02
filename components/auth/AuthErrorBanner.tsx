"use client";

import { forwardRef } from "react";

export const AuthErrorBanner = forwardRef<
  HTMLParagraphElement,
  { message: string }
>(function AuthErrorBanner({ message }, ref) {
  return (
    <p
      ref={ref}
      role="alert"
      aria-live="assertive"
      className="auth-error-banner"
    >
      {message}
    </p>
  );
});
