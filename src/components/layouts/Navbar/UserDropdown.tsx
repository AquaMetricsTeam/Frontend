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
import { useAuth } from "@/components/Providers/AuthProvider";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface UserDropdownProps {
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function UserDropdown({ className }: UserDropdownProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const displayName = user?.fullName ?? "—";
  const displayEmail = user?.email ?? "";
  const displayRole = user?.roles?.[0] ?? "";
  const initials = displayName !== "—" ? getInitials(displayName) : "?";

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
          <span className="text-[11px] font-bold text-primary">{initials}</span>
          <span className="absolute bottom-0 inset-e-0 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>
        <div className="hidden md:flex flex-col text-start min-w-0 me-1">
          <span className="truncate text-xs font-semibold leading-tight text-foreground">
            {displayName}
          </span>
          <span className="truncate text-[10px] text-muted-foreground">
            {displayRole}
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>
              <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                {displayRole}
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
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-xs">
            <MdKeyboard className="size-4 text-muted-foreground" />
            <span>Keyboard Shortcuts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <MdLogout className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>



      </DropdownMenuContent>
    </DropdownMenu>
  );
}
