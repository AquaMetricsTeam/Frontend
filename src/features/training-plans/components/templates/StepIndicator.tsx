import { MdCheck } from "react-icons/md";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: { label: string }[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const progressPercentage =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative flex items-center justify-between py-2">
      {/* Background Connecting Line */}
      <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 h-0.5 bg-muted z-0" />

      {/* Active Progress Line */}
      <div
        className="absolute top-1/2 left-3 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 ease-in-out z-0"
        style={{ width: `calc(${progressPercentage}% - ${progressPercentage > 0 ? '24px' : '0px'})` }}
      />

      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <div key={step.label} className="flex items-center gap-2 z-10 bg-background px-1">
            <div
              className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 shrink-0",
                isCompleted
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : isCurrent
                    ? "bg-primary/10 text-primary border-2 border-primary shadow-xs ring-4 ring-primary/10"
                    : "bg-muted text-muted-foreground border border-border",
              )}
            >
              {isCompleted ? <MdCheck className="size-4" /> : idx + 1}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:inline-block",
                isCurrent
                  ? "text-foreground font-semibold"
                  : isCompleted
                    ? "text-foreground/80 font-medium"
                    : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
