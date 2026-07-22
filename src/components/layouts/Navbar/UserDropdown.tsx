import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdPerson, MdSettings, MdKeyboard, MdLogout } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  className?: string;
  user?: {
    name: string;
    email: string;
    role: string;
    initials: string;
  };
}

const DEFAULT_USER = {
  name: "Rania Amari",
  email: "rania@aquametrics.com",
  role: "Administrator",
  initials: "RA",
};

export function UserDropdown({
  className,
  user = DEFAULT_USER,
}: UserDropdownProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="User menu"
        className={cn(
          "flex items-center gap-2 rounded-lg p-1 transition-colors duration-150 cursor-pointer",
          "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          className
        )}
      >
        <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30">
          <span className="text-[11px] font-bold text-primary">
            {user.initials}
          </span>
          <span className="absolute bottom-0 inset-e-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>
        <div className="hidden md:flex flex-col text-start min-w-0 me-1">
          <span className="truncate text-xs font-semibold leading-tight text-foreground">
            {user.name}
          </span>
          <span className="truncate text-[10px] text-muted-foreground">
            {user.role}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1">
        {/* User Info Header */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-foreground truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user.email}
              </p>
              <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                {user.role}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 cursor-pointer text-xs"
          >
            <MdPerson className="size-4 text-muted-foreground" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 cursor-pointer text-xs"
          >
            <MdSettings className="size-4 text-muted-foreground" />
            <span>{t("common:nav.items.settings")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-xs">
            <MdKeyboard className="size-4 text-muted-foreground" />
            <span>Keyboard Shortcuts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10">
          <MdLogout className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
