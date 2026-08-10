import { useState } from "react";
import { MdUnfoldMore, MdCheck, MdErrorOutline } from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxSelectProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: ComboboxOption[];
  value: string;
  onValueChange: (val: string) => void;
  hasValue?: boolean;
  disabled?: boolean;
  className?: string;
  /** Optional clear option label — if set, adds an "all" entry */
  clearLabel?: string;
  error?: string;
}

/**
 * Standalone combobox with search — works outside of react-hook-form.
 * Mirrors SelectField's Popover+Command pattern exactly.
 */
export function ComboboxSelect({
  label,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results.",
  options,
  value,
  onValueChange,
  hasValue,
  disabled,
  className,
  clearLabel,
  error,
}: ComboboxSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-2",
            "text-sm transition-colors duration-150 cursor-pointer",
            "hover:border-ring/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !selectedLabel && "text-muted-foreground",
            hasValue && "border-primary/50 bg-primary/5 font-medium text-foreground",
            error && "border-destructive focus:ring-destructive/50",
          )}
        >
          <span className="truncate text-xs">{selectedLabel ?? placeholder}</span>
          <MdUnfoldMore className="ms-2 size-4 shrink-0 text-muted-foreground" />
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {clearLabel && (
                  <CommandItem
                    value="__clear__"
                    onSelect={() => {
                      onValueChange("");
                      setOpen(false);
                    }}
                    className="text-xs text-muted-foreground"
                  >
                    {clearLabel}
                    {!value && <MdCheck className="ms-auto size-4 text-primary" />}
                  </CommandItem>
                )}
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={`${opt.label} ${opt.value}`}
                    onSelect={() => {
                      onValueChange(opt.value === value ? "" : opt.value);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between text-xs cursor-pointer"
                  >
                    {opt.label}
                    {value === opt.value && (
                      <MdCheck className="size-4 text-primary" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-1.5 text-xs text-destructive mt-0.5"
        >
          <MdErrorOutline className="size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
