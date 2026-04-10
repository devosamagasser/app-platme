import { Skeleton } from "@/components/ui/skeleton";

const ComposerSkeleton = () => (
  <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
    {/* Header */}
    <div className="h-12 border-b border-primary/8 bg-card flex items-center px-4 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>

    <div className="flex flex-1 overflow-hidden">
      {/* Left panel */}
      <div className="w-[380px] border-e border-primary/8 bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-primary/8 flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div className="flex flex-col items-center pt-8">
            <Skeleton className="h-20 w-20 rounded-full mb-4" />
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-56 mb-6" />
            <div className="grid grid-cols-2 gap-2 w-full">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Center panel */}
      <div className="flex-1 flex items-center justify-center">
        <Skeleton className="h-64 w-64 rounded-2xl" />
      </div>

      {/* Right panel */}
      <div className="w-[260px] border-s border-primary/8 bg-card shrink-0 p-4 space-y-3">
        <Skeleton className="h-4 w-24 mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export default ComposerSkeleton;
