import Link from "next/link";
import { Icon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="container-g flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="text-7xl font-black tracking-tight text-brand">404</span>
      <h1 className="mt-4 text-2xl font-black text-gp-text">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-gp-text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-brand">
          <Icon name="home" className="h-4 w-4" />
          Back home
        </Link>
        <Link href="/search" className="btn-ghost">
          Browse the shop
        </Link>
      </div>
    </div>
  );
}
