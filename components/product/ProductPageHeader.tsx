"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Icon } from "@/components/Icons";
import { useToast } from "@/components/Toast";

export function ProductPageHeader({
  title,
  backHref
}: {
  title: string;
  backHref?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Share this product with friends." });
    } catch {
      /* user cancelled share sheet */
    }
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-gp-border/80 bg-white/95 backdrop-blur-xl"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="container-g grid h-14 grid-cols-[3rem_1fr_3rem] items-center gap-2">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Go back"
            className="grid h-10 w-10 place-items-center rounded-xl text-gp-text transition-colors hover:bg-gp-muted"
          >
            <Icon name="chevron-left" className="h-6 w-6" />
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.back()}
            className="grid h-10 w-10 place-items-center rounded-xl text-gp-text transition-colors hover:bg-gp-muted"
          >
            <Icon name="chevron-left" className="h-6 w-6" />
          </button>
        )}

        <Link
          href="/"
          className="flex justify-center"
          aria-label="G-Products home"
        >
          <Logo size="md" />
        </Link>

        <button
          type="button"
          aria-label="Share product"
          onClick={handleShare}
          className="grid h-10 w-10 place-items-center justify-self-end rounded-xl text-gp-text transition-colors hover:bg-gp-muted"
        >
          <Icon name="share" className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
