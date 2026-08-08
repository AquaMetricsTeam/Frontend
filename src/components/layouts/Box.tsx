import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BoxProps {
  children: ReactNode;
  className?: string;
}

const Box = ({ children, className }: BoxProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 shadow-xs",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
