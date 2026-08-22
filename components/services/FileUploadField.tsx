"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icons";

type Preview = {
  id: string;
  file: File;
  url: string;
  isImage: boolean;
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadField({
  files,
  onChange,
  required,
  label,
  hint,
  accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp",
  multiple = true,
  maxFiles = 8
}: {
  files: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
  label: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}) {
  const [error, setError] = useState("");

  const previews = useMemo<Preview[]>(
    () =>
      files.map((file, i) => ({
        id: `${file.name}-${file.size}-${i}`,
        file,
        url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        isImage: file.type.startsWith("image/")
      })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, [previews]);

  function mergeIncoming(list: FileList | null) {
    if (!list?.length) return;
    setError("");
    const next = multiple ? [...files] : [];
    for (const file of Array.from(list)) {
      if (file.size > 12 * 1024 * 1024) {
        setError(`${file.name} is over 12MB.`);
        continue;
      }
      if (next.length >= maxFiles) {
        setError(`You can upload up to ${maxFiles} files.`);
        break;
      }
      next.push(file);
    }
    onChange(next);
  }

  function removeAt(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-white">
          {label}
          {required ? <span className="text-brand"> *</span> : null}
        </p>
        {hint ? (
          <p className="mt-1 text-xs leading-relaxed text-white/45">{hint}</p>
        ) : null}
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[1.15rem] border border-dashed border-brand/35 bg-brand/[0.04] px-4 py-8 text-center transition-colors hover:border-brand/55 hover:bg-brand/[0.07]">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/25">
          <Icon name="image" className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold text-white">
          Tap to upload from your phone
        </span>
        <span className="text-xs text-white/40">
          PDF, Word, or photos · max 12MB each · full quality kept
        </span>
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          required={required && files.length === 0}
          onChange={(e) => {
            mergeIncoming(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
        />
      </label>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      {previews.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {previews.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-ink-900/80 p-2.5"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-850">
                {p.isImage && p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-brand">
                    <Icon name="file" className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white/90">
                  {p.file.name}
                </p>
                <p className="text-xs text-white/40">
                  {formatBytes(p.file.size)} · ready to send
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white"
                aria-label="Remove file"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
