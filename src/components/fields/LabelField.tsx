import { type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MdInfoOutline } from "react-icons/md";

interface LabelFieldProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children?: ReactNode;
}

export function LabelField({
  htmlFor,
  label,
  required,
  hint,
  className,
  children,
}: LabelFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-1.5">
        <Label
          htmlFor={htmlFor}
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          {label}
          {required && (
            <span className="ms-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>

        {hint && (
          <Tooltip>
            <TooltipTrigger
                type="button"
                className="flex items-center text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                aria-label={hint}
              >
                <MdInfoOutline className="size-3.5" />
              </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[200px] text-xs">
              {hint}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {children}
    </div>
  );
}
