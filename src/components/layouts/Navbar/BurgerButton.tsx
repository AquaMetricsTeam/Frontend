import { MdMenu } from "react-icons/md";
import { cn } from "@/lib/utils";

interface BurgerButtonProps {
  onClick: () => void;
  className?: string;
}

export function BurgerButton({ onClick, className }: BurgerButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open menu"
      className={cn(
        "flex size-9 items-center justify-center rounded-lg lg:hidden",
        "text-muted-foreground transition-colors duration-150",
        "hover:bg-accent hover:text-foreground",
        className
      )}
    >
      <MdMenu className="size-5" />
    </button>
  );
}
