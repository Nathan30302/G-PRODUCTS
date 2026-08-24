"use client";

import { useActionState, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  saveLocationPhotos,
  type LocationActionState
} from "@/app/admin/(dashboard)/locations/actions";

export function LocationPhotosForm({
  locationId,
  locationName,
  initialUrls
}: {
  locationId: string;
  locationName: string;
  initialUrls: string[];
}) {
  const [urls, setUrls] = useState(initialUrls);
  const [state, action, pending] = useActionState<
    LocationActionState | undefined,
    FormData
  >(saveLocationPhotos, undefined);

  const count = urls.length;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locationId" value={locationId} />
      <input type="hidden" name="photoUrls" value={urls.join("\n")} />

      <div className="rounded-2xl border border-white/[0.06] bg-ink-950/35 px-4 py-3.5 sm:px-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
          Shop photos
        </p>
        <p className="mt-1 text-sm leading-relaxed text-white/55">
          Upload clear photos of{" "}
          <span className="font-semibold text-white/80">{locationName}</span>.
          The first photo is the cover on the homepage locations band.
        </p>
        {count > 0 ? (
          <p className="mt-2 text-xs font-semibold text-brand/90">
            {count} photo{count === 1 ? "" : "s"} ready — save to publish.
          </p>
        ) : (
          <p className="mt-2 text-xs text-white/40">
            No photos yet — customers will see the location name only until you
            add some.
          </p>
        )}
      </div>

      <ImageUploader
        folder="misc"
        multiple
        label="Location photos"
        urls={urls}
        onUrlsChange={setUrls}
        downloadPrefix={locationId}
        previewHint="Cover photo is what shoppers see first on the homepage locations band."
      />
      {state?.error ? (
        <p className="text-sm text-red-300">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="text-sm text-accent">{state.success}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="btn-brand px-5 py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save location photos"}
      </button>
    </form>
  );
}
