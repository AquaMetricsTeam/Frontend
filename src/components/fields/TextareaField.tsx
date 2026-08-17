import { type ReactNode } from "react";
import {
  type FieldValues,
  type FieldPath,
  type RegisterOptions,
  useFormContext,
  Controller,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { LabelField } from "./LabelField";
import { cn } from "@/lib/utils";
import { MdErrorOutline } from "react-icons/md";

interface TextareaFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label: ReactNode;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
  rules?: RegisterOptions<TFieldValues>;
  disabled?: boolean;
  className?: string;
  textareaClassName?: string;
}

export function TextareaField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  rows = 3,
  required,
  hint,
  rules,
  disabled,
  className,
  textareaClassName,
}: TextareaFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <LabelField
          htmlFor={name}
          label={label}
          required={required}
          hint={hint}
          className={className}
        >
          <Textarea
            {...field}
            value={field.value ?? ""}
            id={name}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={cn(
              "resize-none text-sm transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0",
              error && "border-destructive focus-visible:ring-destructive/50",
              textareaClassName
            )}
          />

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
      )}
    />
  );
}
