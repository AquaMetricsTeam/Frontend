import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdSearch } from "react-icons/md";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { useAuth } from "@/components/Providers/AuthProvider";

export function CommandSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5",
          "text-xs text-muted-foreground transition-all duration-150",
          "hover:border-ring/40 hover:bg-accent hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "w-36 md:w-56 lg:w-64 justify-between",
          className
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <MdSearch className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{t("common:table.search")}</span>
        </div>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-80">
          <span className="text-[9px]">Ctrl</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>{t("common:table.search")}</DialogTitle>
          </DialogHeader>

          <Command className="rounded-lg border-none">
            <CommandInput
              placeholder={t("common:table.search")}
              className="h-11"
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>{t("common:table.noResults")}</CommandEmpty>

              <CommandGroup heading="Pages">
                <CommandItem onSelect={() => handleSelect("/")}>
                  <span>Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("/athletes")}>
                  <span>Athletes</span>
                </CommandItem>
                {hasRole("Admin") && (
                  <CommandItem onSelect={() => handleSelect("/users")}>
                    <span>Users & Staff</span>
                  </CommandItem>
                )}
                {hasRole("SwimmingCoach") && (
                  <CommandItem onSelect={() => handleSelect("/swimming")}>
                    <span>Swimming Program</span>
                  </CommandItem>
                )}
                {hasRole("FitnessCoach") && (
                  <CommandItem onSelect={() => handleSelect("/fitness")}>
                    <span>Fitness Program</span>
                  </CommandItem>
                )}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading="Quick Actions">
                <CommandItem onSelect={() => handleSelect("/attendance")}>
                  <span>Check Attendance</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("/reports")}>
                  <span>Generate Report</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSelect("/settings")}>
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
