"use client";

import { useRef, useState, useTransition } from "react";

type Props = {
  /** Form field name that receives the URL(s) — omit when using onUrlsChange */
  name?: string;
  /** Starting URLs already saved on the product/service */
  initialUrls?: string[];
  /** Controlled URLs (overrides initialUrls when set) */
  urls?: string[];
  /** Called when URLs change (for variant editors) */
  onUrlsChange?: (urls: string[]) => void;
  /** products | services | service-pages | misc | browse-tiles */
  folder?: "products" | "services" | "service-pages" | "misc" | "browse-tiles";
  /** Allow multiple photos (products & service galleries). First = cover. */
  multiple?: boolean;
  label?: string;
  /** Provider desk — show download links for reuse (on by default) */
  allowDownload?: boolean;
  /** Prefix for downloaded filenames */
  downloadPrefix?: string;
  /** Override the shop-preview helper copy under the uploader */
  previewHint?: string;
};

function downloadHref(url: string, filename: string): string {
  return `/api/admin/download-photo?url=${encodeURIComponent(url)}&name=${encodeURIComponent(filename)}`;
}

export function ImageUploader({
  name,
  initialUrls = [],
  urls: controlledUrls,
  onUrlsChange,
  folder = "products",
  multiple = true,
  label = "Photos",
  allowDownload = true,
  downloadPrefix = "product",
  previewHint
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalUrls, setInternalUrls] = useState<string[]>(
    initialUrls.filter(Boolean)
  );
  const urls = controlledUrls ?? internalUrls;
  const setUrls = (next: string[] | ((prev: string[]) => string[])) => {
    const resolved = typeof next === "function" ? next(urls) : next;
    if (onUrlsChange) onUrlsChange(resolved);
    else setInternalUrls(resolved);
  };
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const replaceAllRef = useRef(false);

  const value = multiple ? urls.join("\n") : urls[0] ?? "";

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    setUrls((prev) => {
      const j = index + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }

  function makeCover(index: number) {
    setUrls((prev) => {
      if (index === 0) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  }

  function onPick(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const replace = replaceAllRef.current;
    replaceAllRef.current = false;

    const list = Array.from(files);
    startTransition(async () => {
      const next: string[] = multiple && !replace ? [...urls] : [];
      for (const file of list) {
        const body = new FormData();
        body.set("file", file);
        body.set("folder", folder);
        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body,
            credentials: "include",
            cache: "no-store"
          });
          const data = (await res.json().catch(() => ({}))) as {
            url?: string;
            error?: string;
          };
          if (!res.ok || !data.url) {
            const fallback =
              res.status === 401
                ? "Sign in required. Refresh the provider desk and try again."
                : res.status === 413
                  ? "Photo is too large for the server. Try a smaller JPG."
                  : "Upload failed.";
            setError(data.error ?? fallback);
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
        <label className="text-sm font-semibold text-white/70">{label}</label>
        {pending ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            Uploading…
          </span>
        ) : null}
      </div>

      {name ? <input type="hidden" name={name} value={value} /> : null}

      {urls.length > 0 ? (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08] bg-white shadow-inner"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-full w-full object-contain p-2"
              />
              {idx === 0 && (
                <span className="absolute left-2 top-2 rounded-pill bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-950">
                  Cover
                </span>
              )}
              <div className="absolute right-1.5 top-1.5 flex flex-col gap-1">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(idx)}
                    className="rounded-pill bg-ink-950/85 px-2 py-1 text-[10px] font-bold text-brand"
                  >
                    Make cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
                  className="rounded-pill bg-ink-950/85 px-2.5 py-1 text-[10px] font-bold text-white/90"
                >
                  Remove
                </button>
              </div>
              {multiple && urls.length > 1 && (
                <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                  <button
                    type="button"
                    aria-label="Move earlier"
                    disabled={idx === 0}
                    onClick={() => move(idx, -1)}
                    className="grid h-7 w-7 place-items-center rounded-full bg-ink-950/85 text-white disabled:opacity-30"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Move later"
                    disabled={idx === urls.length - 1}
                    onClick={() => move(idx, 1)}
                    className="grid h-7 w-7 place-items-center rounded-full bg-ink-950/85 text-white disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>
              )}
              {allowDownload && (
                <a
                  href={downloadHref(
                    url,
                    `${downloadPrefix}-${idx + 1}${url.match(/\.(png|webp|gif)/i)?.[0] ?? ".jpg"}`
                  )}
                  download
                  className="absolute bottom-1.5 left-1.5 z-10 rounded-pill bg-ink-950/90 px-2.5 py-1.5 text-[10px] font-bold text-brand shadow-lg"
                >
                  Download
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-ink-950/50 px-4 py-8 text-center transition-colors hover:border-brand/40 hover:bg-brand/[0.04] disabled:opacity-50"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-2xl text-brand">
            +
          </span>
          <span className="text-sm font-semibold text-white/80">
            {multiple ? "Add photos" : "Add photo"}
          </span>
          <span className="text-xs text-white/35">
            From your phone · JPG, PNG or WebP (not HEIC)
          </span>
        </button>
      )}

      {urls.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="rounded-pill border border-brand/40 bg-brand/10 px-4 py-2.5 text-sm font-bold text-brand transition-colors hover:bg-brand/20 disabled:opacity-50"
          >
            {multiple ? "Add more photos" : "Replace photo"}
          </button>
          {multiple && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                replaceAllRef.current = true;
                inputRef.current?.click();
              }}
              className="rounded-pill border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white disabled:opacity-50"
            >
              Replace all
            </button>
          )}
        </div>
      )}

      {urls.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/[0.07] bg-ink-950/40 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">
            Shop preview
          </p>
          <p className="mt-1 text-xs text-white/45">
            {previewHint
              ? previewHint
              : folder === "services" || folder === "service-pages"
                ? "Cover photo is what customers see first on tiles and as gallery photo 1."
                : folder === "misc"
                  ? "Cover photo is what customers see first on the locations band."
                  : "Cover photo is what customers see first. White background, full product in frame."}
          </p>
          <div className="mt-3 max-w-[11rem]">
            <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
              <div className="relative aspect-square bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urls[0]}
                  alt=""
                  className="h-full w-full object-contain p-2"
                />
              </div>
              <div className="bg-ink-900 px-2.5 py-2">
                <p className="text-[11px] font-semibold text-white/80">Cover</p>
                <p className="text-[10px] text-white/40">
                  Photo 1 of {urls.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/jpg,.jpg,.jpeg,.png,.webp,.gif"
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
