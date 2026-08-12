"use client";

import { useRef, useState, useTransition } from "react";

type Props = {
  /** Form field name that receives the URL(s) */
  name: string;
  /** Starting URLs already saved on the product/service */
  initialUrls?: string[];
  /** products | services */
  folder?: "products" | "services";
  /** Allow multiple photos (products). Services use a single photo. */
  multiple?: boolean;
  label?: string;
};

export function ImageUploader({
  name,
  initialUrls = [],
  folder = "products",
  multiple = true,
  label = "Photos"
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>(
    initialUrls.filter(Boolean)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const value = multiple ? urls.join("\n") : urls[0] ?? "";

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function onPick(files: FileList | null) {
    if (!files?.length) return;
    setError(null);

    const list = Array.from(files);
    startTransition(async () => {
      const next: string[] = multiple ? [...urls] : [];
      for (const file of list) {
        const body = new FormData();
        body.set("file", file);
        body.set("folder", folder);
        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body
          });
          const data = (await res.json()) as { url?: string; error?: string };
          if (!res.ok || !data.url) {
            setError(data.error ?? "Upload failed.");
            continue;
          }
          if (multiple) next.push(data.url);
          else {
            next.length = 0;
            next.push(data.url);
          }
        } catch {
          setError("Upload failed. Check your connection and try again.");
        }
      }
      setUrls(next);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm text-white/60">{label}</label>
        {pending ? (
          <span className="text-xs font-semibold text-brand">Uploading…</span>
        ) : null}
      </div>

      <input type="hidden" name={name} value={value} />

      {urls.length > 0 ? (
        <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {urls.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-950"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute right-1.5 top-1.5 rounded-pill bg-ink-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/80 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-white/35">
          No photos yet — add clear product shots from your phone.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="rounded-pill border border-brand/40 bg-brand/10 px-4 py-2.5 text-sm font-bold text-brand transition-colors hover:bg-brand/20 disabled:opacity-50"
        >
          {multiple ? "Upload photos" : "Upload photo"}
        </button>
        <span className="text-xs text-white/35">JPG, PNG or WebP · max 15MB each</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => onPick(e.target.files)}
      />

      {error ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
