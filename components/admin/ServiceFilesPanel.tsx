import { Icon } from "@/components/Icons";
import type { ServiceFileInfo } from "@/lib/service-files";
import { DeskPanel, DeskPanelHeader } from "@/components/admin/desk";

function kindLabel(kind: ServiceFileInfo["kind"]): string {
  if (kind === "image") return "Photo";
  if (kind === "pdf") return "PDF";
  if (kind === "doc") return "Document";
  return "File";
}

export function ServiceFilesPanel({
  files,
  emptyHint
}: {
  files: ServiceFileInfo[];
  emptyHint?: string;
}) {
  return (
    <DeskPanel>
      <DeskPanelHeader
        title="Uploaded documents"
        subtitle={
          files.length > 0
            ? `${files.length} file${files.length === 1 ? "" : "s"} · download full / HD quality for printing`
            : "No files attached to this request"
        }
      />
      {files.length === 0 ? (
        <p className="px-5 py-6 text-sm text-white/45">
          {emptyHint ??
            "Customer did not upload documents. Ask them to re-submit or send files on WhatsApp."}
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.05]">
          {files.map((file) => (
            <li key={file.url} className="px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-ink-950 sm:h-24 sm:w-32">
                  {file.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element -- original upload preview, not optimized
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center gap-1 text-brand">
                      <Icon name="file" className="h-8 w-8" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                        {kindLabel(file.kind)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {file.filename}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">
                    {kindLabel(file.kind)} · original quality preserved
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={file.downloadUrl}
                      className="inline-flex items-center gap-1.5 rounded-pill bg-brand px-3.5 py-2 text-xs font-bold text-ink-950 hover:bg-brand-soft"
                    >
                      <Icon name="download" className="h-3.5 w-3.5" />
                      Download HD
                    </a>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-pill border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/75 hover:border-white/30 hover:text-white"
                    >
                      <Icon name="external" className="h-3.5 w-3.5" />
                      Open
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DeskPanel>
  );
}
