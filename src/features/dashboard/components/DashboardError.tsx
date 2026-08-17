import { MdRefresh, MdErrorOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  onRetry: () => void;
}

export function DashboardError({ onRetry }: DashboardErrorProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <MdErrorOutline className="size-7" />
      </div>
      <h2 className="mt-4 text-base font-bold text-foreground">Failed to load dashboard</h2>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm">
        Could not fetch dashboard data. Check your connection and try again.
      </p>
      <Button
        size="sm"
        onClick={onRetry}
        className="mt-5 rounded-xl gap-2 text-xs font-semibold cursor-pointer"
      >
        <MdRefresh className="size-4" />
        Retry
      </Button>
    </div>
  );
}
