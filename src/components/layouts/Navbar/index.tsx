import { MdPool } from "react-icons/md";
import { BurgerButton } from "./BurgerButton";
import { Breadcrumbs } from "./Breadcrumbs";
import { CommandSearch } from "./CommandSearch";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import { UserDropdown } from "./UserDropdown";

interface NavbarProps {
  onBurgerClick: () => void;
}

function Navbar({ onBurgerClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center border-b border-border bg-background/85 backdrop-blur-md px-4 gap-3 transition-colors">
      {/* Left section: mobile burger + logo (mobile) OR breadcrumbs (desktop) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 lg:hidden">
          <BurgerButton onClick={onBurgerClick} />
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/15">
              <MdPool className="size-3.5 text-primary" />
            </div>
            <span
              className="text-[13px] font-bold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Aqua Metrics
            </span>
          </div>
        </div>

        <Breadcrumbs />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Center/Right: Search */}
      <CommandSearch />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <NotificationBell />
        <LangToggle />
        <ThemeToggle />
        <div className="mx-1 h-5 w-px bg-border" />
        <UserDropdown />
      </div>
    </header>
  );
}

export default Navbar;
