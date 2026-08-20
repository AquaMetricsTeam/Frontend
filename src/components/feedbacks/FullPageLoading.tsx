import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import Spinner from "./Spinner";
import { cn } from "@/lib/utils";

interface FullPageLoadingProps {
  className?: string;
  children?: ReactNode;
}

const FullPageLoading = ({ className, children }: FullPageLoadingProps) => {
  return createPortal(
    <div
      className={cn(
        `fixed top-0 left-0 z-[99999999999] flex h-screen w-full items-center justify-center bg-[rgba(0,0,0,0.5)]`,
        className,
      )}
    >
      {children ?? <Spinner />}
    </div>,
    document.getElementById("portal") || (document.body as HTMLElement),
  );
};

export default FullPageLoading;