
import { Skeleton } from "@/components/ui/skeleton";
import { Layout } from "@/components/layout/Layout";

export const CotizacionSkeleton = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    </Layout>
  );
};
