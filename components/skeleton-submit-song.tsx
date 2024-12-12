import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface SkeletonSubmitProps {
  className?: string;
}

export function SkeletonSubmit(props: SkeletonSubmitProps) {
  const values = ["mr-2","mr-3","mr-4", "mr-6", "mr-8", "mr-10", "mr-12", "mr-14", "mr-16"];

  const paddingX1 = values[Math.floor(Math.random() * values.length)];
  const paddingX2 = values[Math.floor(Math.random() * values.length)];

  return (
    <div
      className={cn(
        "flex flex-row items-center px-5 w-10/12 py-4 rounded-xl my-3 border justify-between",
        props.className
      )}
    >
      <div className="flex flex-col gap-3 pr-4 w-full">
        <Skeleton
          className={cn(
            "flex py-3 rounded-xl",
            paddingX1
          )}
        />
        <Skeleton
          className={cn(
            "flex py-3 rounded-xl",
            paddingX2
          )}
        />
      </div>
      <Skeleton className="py-4 px-10" />
    </div>
  );
}
