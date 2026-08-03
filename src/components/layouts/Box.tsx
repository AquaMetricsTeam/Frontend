import type { ReactNode } from "react";

interface BoxProps {
  children: ReactNode;
}
const Box = ({ children }: BoxProps) => {
  return (
    <div className="flex  flex-col gap-6 rounded-2xl border border-border bg-card p-5 shadow-xs">
      {children}
    </div>
  );
};

export default Box;
