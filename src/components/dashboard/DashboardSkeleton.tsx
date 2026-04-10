import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => (
  <div className="min-h-screen flex w-full bg-background bg-grid">
    {/* Sidebar skeleton */}
    <div className="w-[260px] border-e border-primary/8 bg-card hidden md:flex flex-col shrink-0">
      <div className="p-4 flex justify-center">
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="px-3 space-y-2 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    </div>

    {/* Main content skeleton */}
    <div className="flex-1 flex flex-col min-w-0">
      <div className="h-12 border-b border-primary/8 bg-card px-4 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <div className="p-6 max-w-4xl w-full space-y-6">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="panel-glass p-4 space-y-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-20" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel-glass p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
