import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function StatusBadge({ isActive, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold border",
        isActive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        className
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
