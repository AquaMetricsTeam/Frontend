import { cn } from "@/lib/utils";

interface LoadingProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "size-6 border-2",
  md: "size-10 border-4",
  lg: "size-14 border-4",
};

export function Loading({
  label = "Loading…",
  className,
  size = "md",
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8",
        className,
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-primary border-t-transparent",
          SIZE_MAP[size],
        )}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

export default Loading;
