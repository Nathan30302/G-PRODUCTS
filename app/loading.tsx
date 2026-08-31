import { ProductGridSkeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="container-g space-y-12 py-8">
      <ProductGridSkeleton count={6} />
    </div>
  );
}
