import { useRef, useCallback } from "react";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function parseTimeSpanToSeconds(timeStr?: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(":");
  if (parts.length === 3)
    return (
      (Number(parts[0]) || 0) * 3600 +
      (Number(parts[1]) || 0) * 60 +
      (Number(parts[2]) || 0)
    );
  if (parts.length === 2)
    return (Number(parts[0]) || 0) * 60 + (Number(parts[1]) || 0);
  return 0;
}

export function formatTimeSpanDisplay(timeStr?: string): string {
  if (!timeStr) return "--:--";
  const parts = timeStr.split(":");
  if (parts.length === 3)
    return `${parts[1].padStart(2, "0")}:${parts[2].padStart(2, "0")}`;
  if (parts.length === 2)
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  return timeStr;
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// ─── SpinBox ──────────────────────────────────────────────────────────────────

interface SpinBoxProps {
  value: number;
  min: number;
  max: number;
  unitLabel: string;
  onChange: (n: number) => void;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  onNext?: () => void;
  onPrev?: () => void;
}

function SpinBox({
  value,
  min,
  max,
  unitLabel,
  onChange,
  disabled,
  inputRef,
  onNext,
}: SpinBoxProps) {
  function inc() {
    onChange(clamp(value + 1, min, max));
  }
  function dec() {
    onChange(clamp(value - 1, min, max));
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    const n = Math.min(Number(raw) || 0, max);
    onChange(n);
    // Auto-advance to next segment when 2 digits typed
    if (raw.length === 2 && onNext) onNext();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") { e.preventDefault(); inc(); }
    if (e.key === "ArrowDown") { e.preventDefault(); dec(); }
    if (e.key === "Tab" && !e.shiftKey && onNext) { e.preventDefault(); onNext(); }
    if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
      e.preventDefault();
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Up arrow */}
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={inc}
        className="flex items-center justify-center w-full h-5 rounded-t text-muted-foreground/60 hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 cursor-pointer"
      >
        <MdKeyboardArrowUp className="size-3.5" />
      </button>

      {/* Value display / input */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        value={pad(value)}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={(e) => e.target.select()}
        disabled={disabled}
        aria-label={unitLabel}
        className={cn(
          "w-9 h-8 text-center bg-transparent font-mono font-bold text-sm text-foreground",
          "focus:outline-none tabular-nums leading-none",
        )}
      />

      {/* Down arrow */}
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={dec}
        className="flex items-center justify-center w-full h-5 rounded-b text-muted-foreground/60 hover:text-foreground hover:bg-accent transition-colors disabled:opacity-30 cursor-pointer"
      >
        <MdKeyboardArrowDown className="size-3.5" />
      </button>

      {/* Unit label */}
      <span className="text-[9px] uppercase font-semibold text-muted-foreground/50 tracking-wider mt-0.5">
        {unitLabel}
      </span>
    </div>
  );
}

// ─── TimeInput ────────────────────────────────────────────────────────────────

interface TimeInputProps {
  /** "00:MM:SS" or "MM:SS" */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /** Tailwind color class for the label dot accent, e.g. "text-emerald-500" */
  accentClass?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Polished MM:SS time picker with:
 * - Up / Down spinner buttons (click or keyboard arrows)
 * - Auto-advance from minutes → seconds on 2-digit entry
 * - Focus-ring matching shadcn design system
 * - Color-coded label dot (Best=green, Avg=foreground, Worst=rose)
 */
export function TimeInput({
  value,
  onChange,
  label,
  accentClass = "text-foreground",
  disabled = false,
  className,
}: TimeInputProps) {
  const secRef = useRef<HTMLInputElement>(null);
  const minRef = useRef<HTMLInputElement>(null);

  // Parse value
  const parts = value?.split(":") ?? [];
  const mm =
    parts.length === 3 ? Number(parts[1]) || 0 : Number(parts[0]) || 0;
  const ss =
    parts.length === 3 ? Number(parts[2]) || 0 : Number(parts[1]) || 0;

  const emit = useCallback(
    (newMm: number, newSs: number) => {
      onChange(`00:${pad(clamp(newMm, 0, 99))}:${pad(clamp(newSs, 0, 59))}`);
    },
    [onChange],
  );

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn("h-2 w-2 rounded-full bg-current shrink-0", accentClass)}
          />
          <span className="text-[11px] font-semibold text-muted-foreground leading-none">
            {label}
          </span>
        </div>
      )}

      <div
        className={cn(
          "inline-flex items-center gap-1 rounded-xl border border-input bg-background px-2.5 py-0.5",
          "focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50",
          "shadow-xs hover:border-ring/60 transition-all",
          disabled && "opacity-50 pointer-events-none bg-muted/30",
        )}
      >
        <SpinBox
          value={mm}
          min={0}
          max={99}
          unitLabel="min"
          inputRef={minRef}
          onChange={(n) => emit(n, ss)}
          disabled={disabled}
          onNext={() => secRef.current?.focus()}
        />

        <span className="font-bold text-muted-foreground/40 font-mono text-lg select-none">
          :
        </span>

        <SpinBox
          value={ss}
          min={0}
          max={59}
          unitLabel="sec"
          inputRef={secRef}
          onChange={(n) => emit(mm, n)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
