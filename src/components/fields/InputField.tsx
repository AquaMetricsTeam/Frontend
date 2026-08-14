import { useState, type ReactNode } from "react";
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
import { MdErrorOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";

export interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
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
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  autoComplete?: string;
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
  startIcon,
  endIcon,
  autoComplete,
}: InputFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const effectiveType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

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
          <div className="relative flex items-center w-full">
            {startIcon && (
              <div className="absolute start-3 flex items-center pointer-events-none text-muted-foreground">
                {startIcon}
              </div>
            )}

            <Input
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                if (effectiveType === "number") {
                  const val = e.target.value;
                  field.onChange(val === "" ? null : Number(val));
                } else {
                  field.onChange(e);
                }
              }}
              id={name}
              type={effectiveType}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(
                "h-10 text-sm transition-all duration-150",
                startIcon && "ps-9",
                (endIcon || isPasswordType) && "pe-9",
                "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0",
                error && "border-destructive focus-visible:ring-destructive/50",
                inputClassName
              )}
            />

            {isPasswordType ? (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute end-3 flex items-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <MdVisibilityOff className="size-4" />
                ) : (
                  <MdVisibility className="size-4" />
                )}
              </button>
            ) : (
              endIcon && (
                <div className="absolute end-3 flex items-center pointer-events-none text-muted-foreground">
                  {endIcon}
                </div>
              )
            )}
          </div>

          {error?.message && (
            <div
              id={`${name}-error`}
              role="alert"
              className="flex items-center gap-1.5 text-xs text-destructive mt-1"
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
