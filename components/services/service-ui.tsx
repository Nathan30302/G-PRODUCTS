"use client";

import type { ReactNode } from "react";
import {
  FormSection,
  ServiceSteps
} from "@/components/services/ServiceSteps";
import { ServiceResult } from "@/components/services/ServiceResult";
import { PaymentPicker, type PayMethod } from "@/components/services/PaymentPicker";
import { DeliveryPicker, type DeliveryMethod } from "@/components/services/DeliveryPicker";
import { FileUploadField } from "@/components/services/FileUploadField";

export {
  FormSection,
  ServiceSteps,
  ServiceResult,
  PaymentPicker,
  DeliveryPicker,
  FileUploadField,
  type PayMethod,
  type DeliveryMethod
};

export const serviceField = "field mt-2";
export const serviceLabel = "service-label";

export function serviceOptionClass(selected: boolean, large = false) {
  return `${large ? "service-option-lg" : "service-option"} ${
    selected ? "service-option-active" : ""
  }`.trim();
}

export function ServiceEstimateBox({
  children,
  footnote
}: {
  children: ReactNode;
  footnote?: string;
}) {
  return (
    <div className="service-estimate">
      {children}
      {footnote ? (
        <p className="text-xs text-gp-text-subtle">{footnote}</p>
      ) : null}
    </div>
  );
}

export function ServiceSubmitButton({
  busy,
  label,
  busyLabel = "Placing order..."
}: {
  busy: boolean;
  label: string;
  busyLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="btn-brand w-full disabled:opacity-60"
    >
      {busy ? busyLabel : label}
    </button>
  );
}
