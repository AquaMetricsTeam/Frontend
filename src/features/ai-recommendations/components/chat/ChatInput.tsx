import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSend } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { sendChatMessageSchema } from "../../constants/validations";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isSending?: boolean;
}

export default function ChatInput({ onSend, disabled, isSending }: ChatInputProps) {
  const { t } = useTranslation("aiChat");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    const result = sendChatMessageSchema.safeParse({ message: value });
    if (!result.success) {
      const rawKey = result.error.flatten().fieldErrors.message?.[0] ?? null;
      setError(rawKey ? t(rawKey) : null);
      return;
    }
    setError(null);
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("message.sendPlaceholder")}
          disabled={disabled || isSending}
          rows={1}
          className={cn(
            "min-h-[40px] max-h-[120px] resize-none text-sm",
            error && "border-destructive focus-visible:ring-destructive/50",
          )}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={disabled || isSending || !value.trim()}
          className="shrink-0 cursor-pointer"
        >
          {isSending ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <MdSend className="size-4" />
          )}
        </Button>
      </div>
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
