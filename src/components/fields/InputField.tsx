import {
  type FieldValues,
  type FieldPath,
  type RegisterOptions,
  useFormContext,
  Controller,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { LabelField } from "./LabelField";
import { cn } from "@/lib/utils";
import { MdErrorOutline } from "react-icons/md";

interface InputFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  required?: boolean;
  hint?: string;
  rules?: RegisterOptions<TFieldValues>;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

export function InputField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  required,
  hint,
  rules,
  disabled,
  className,
  inputClassName,
}: InputFieldProps<TFieldValues>) {
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
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={cn(
              "h-9 text-sm transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0",
              error && "border-destructive focus-visible:ring-destructive/50",
              inputClassName
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
