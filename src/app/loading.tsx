import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <Skeleton className="w-110 h-200" />
    </div>
  );
}

export default Loading;
