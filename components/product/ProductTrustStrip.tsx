import { Icon } from "@/components/Icons";

const rows = [
  {
    icon: "shield",
    title: "Genuine stock",
    hint: "Verified products with fair campus pricing."
  },
  {
    icon: "refresh",
    title: "Hassle-free support",
    hint: "Message us on WhatsApp if anything isn't right."
  },
  {
    icon: "truck",
    title: "Fast pickup & delivery",
    hint: "Free campus delivery where applicable · 4 pickup spots."
  }
] as const;

export function ProductTrustStrip() {
  return (
    <div className="divide-y divide-gp-border border-y border-gp-border">
      {rows.map((row) => (
        <div key={row.title} className="flex gap-3 py-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gp-border bg-gp-muted/50 text-gp-text">
            <Icon name={row.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gp-text">{row.title}</p>
            <p className="mt-0.5 text-sm text-gp-text-muted">{row.hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
