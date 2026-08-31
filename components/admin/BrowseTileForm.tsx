"use client";

import { useActionState, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  createBrowseTile,
  updateBrowseTile,
  type BrowseTileActionState
} from "@/app/admin/(dashboard)/browse-tiles/actions";

export function BrowseTileForm({
  tile
}: {
  tile?: {
    id: string;
    label: string;
    href: string;
    imageUrl: string | null;
    isPromo: boolean;
    sortOrder: number;
    enabled: boolean;
  };
}) {
  const action = tile ? updateBrowseTile : createBrowseTile;
  const [state, formAction, pending] = useActionState<
    BrowseTileActionState | undefined,
    FormData
  >(action, undefined);
  const [imageUrl, setImageUrl] = useState(tile?.imageUrl ?? "");

  return (
    <form action={formAction} className="space-y-4">
      {tile ? <input type="hidden" name="id" value={tile.id} /> : null}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Label</span>
          <input
            name="label"
            defaultValue={tile?.label ?? ""}
            required
            placeholder="Chargers"
            className="field"
          />
        </label>
        <label className="block">
          <span className="field-label">Link (href)</span>
          <input
            name="href"
            defaultValue={tile?.href ?? "/search"}
            required
            placeholder="/search?q=charger"
            className="field"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="field-label">Sort order</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={tile?.sortOrder ?? 0}
            className="field"
          />
        </label>
        <label className="flex items-end gap-2 pb-3">
          <input
            type="checkbox"
            name="isPromo"
            value="1"
            defaultChecked={tile?.isPromo ?? false}
            className="h-4 w-4 rounded border-white/20"
          />
          <span className="text-sm text-white/70">Promotional tile (taller)</span>
        </label>
        {tile ? (
          <label className="flex items-end gap-2 pb-3">
            <input
              type="checkbox"
              name="enabled"
              value="1"
              defaultChecked={tile.enabled}
              className="h-4 w-4 rounded border-white/20"
            />
            <span className="text-sm text-white/70">Visible on shop</span>
          </label>
        ) : null}
      </div>

      <ImageUploader
        folder="browse-tiles"
        multiple={false}
        label="Background photo"
        urls={imageUrl ? [imageUrl] : []}
        onUrlsChange={(urls) => setImageUrl(urls[0] ?? "")}
        downloadPrefix="browse-tile"
        previewHint="Wide landscape photos work best. Shoppers see this behind the category name."
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
        {pending ? "Saving…" : tile ? "Save tile" : "Add tile"}
      </button>
    </form>
  );
}
