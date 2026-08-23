"use client";

import { useActionState, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  saveLocationPhotos,
  type LocationActionState
} from "@/app/admin/(dashboard)/locations/actions";

export function LocationPhotosForm({
  locationId,
  initialUrls
}: {
  locationId: string;
  initialUrls: string[];
}) {
  const [urls, setUrls] = useState(initialUrls);
  const [state, action, pending] = useActionState<
    LocationActionState | undefined,
    FormData
  >(saveLocationPhotos, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locationId" value={locationId} />
      <input type="hidden" name="photoUrls" value={urls.join("\n")} />
      <ImageUploader
        folder="misc"
        multiple
        label="Location photos"
        urls={urls}
        onUrlsChange={setUrls}
        downloadPrefix={locationId}
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
        {pending ? "Saving…" : "Save photos"}
      </button>
    </form>
  );
}
