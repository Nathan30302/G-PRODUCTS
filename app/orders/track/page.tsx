import type { Metadata } from "next";
import Link from "next/link";
import { OrderTrackClient } from "@/components/orders/OrderTrackClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Track your order",
  description: `Track a ${siteConfig.name} shop order with your reference number.`
};

export default async function OrderTrackPage({
  searchParams
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <div className="container-g py-10 sm:py-14">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
          Orders
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Track your order
        </h1>
        <p className="mt-3 text-sm text-white/55">
          Enter the reference from checkout (starts with GP-). Signed-in
          customers can also see recent orders in{" "}
          <Link href="/profile/account" className="text-brand hover:underline">
            Account
          </Link>
          .
        </p>
      </div>
      <div className="mt-8">
        <OrderTrackClient initialRef={ref?.toUpperCase() ?? ""} />
      </div>
    </div>
  );
}
