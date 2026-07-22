import { useState } from "react";
import {
  type FieldValues,
  type FieldPath,
  type RegisterOptions,
  useFormContext,
  Controller,
} from "react-hook-form";
import { LabelField } from "./LabelField";
import { cn } from "@/lib/utils";
import { MdErrorOutline, MdUnfoldMore, MdCheck } from "react-icons/md";
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

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
  hint?: string;
  rules?: RegisterOptions<TFieldValues>;
  disabled?: boolean;
  className?: string;
}

export function SelectField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  required,
  hint,
  rules,
  disabled,
  className,
}: SelectFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const selectedLabel = options.find((o) => o.value === field.value)?.label;

        return (
          <LabelField
            htmlFor={name}
            label={label}
            required={required}
            hint={hint}
            className={className}
          >
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                id={name}
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-invalid={!!error}
                disabled={disabled}
                className={cn(
                  "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2",
                  "text-sm transition-colors duration-150",
                  "hover:border-ring/50",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  !selectedLabel && "text-muted-foreground",
                  error && "border-destructive focus:ring-destructive/50"
                )}
              >
                <span className="truncate">{selectedLabel ?? placeholder}</span>
                <MdUnfoldMore className="ms-2 size-4 shrink-0 text-muted-foreground" />
              </PopoverTrigger>

              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder={searchPlaceholder} className="h-9" />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(val) => {
                            field.onChange(val === field.value ? "" : val);
                            setOpen(false);
                          }}
                          className="flex items-center justify-between text-sm"
                        >
                          {option.label}
                          {field.value === option.value && (
                            <MdCheck className="size-4 text-primary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {error?.message && (
              <div
                id={`${name}-error`}
                role="alert"
                className="flex items-center gap-1.5 text-xs text-destructive"
              >
                <MdErrorOutline className="size-3.5 shrink-0" />
                <span>{error.message}</span>
              </div>
            )}
          </LabelField>
        );
      }}
    />
  );
}
