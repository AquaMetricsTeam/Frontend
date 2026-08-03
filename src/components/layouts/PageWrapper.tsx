import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
  titleKey?: PageTitleKey;
};

function PageWrapper({
  children,
  className,
  titleKey: _titleKey,
}: PageWrapperProps) {
  return (
    <main
      className={cn(
        "animate-fade-up h-full flex  flex-col px-7.5 py-5",
        className,
      )}
    >
      {children}
    </main>
  );
}

export default PageWrapper;
