import { useTranslation } from "react-i18next";
import { MdSmartToy, MdPerson } from "react-icons/md";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import type { ChatMessageResponse } from "../../types/index";
import ChatEvidenceChips from "./ChatEvidenceChips";

interface ChatMessageBubbleProps {
  message: ChatMessageResponse;
}

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const { t } = useTranslation("aiChat");
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MdSmartToy className="size-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="break-words [&_*]:my-0 [&_p]:my-1 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_h1]:my-2 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:my-2 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:my-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_blockquote]:border-s-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:ps-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted-foreground/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_pre]:my-1.5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted-foreground/10 [&_pre]:p-3 [&_pre]:text-xs [&_table]:my-1.5 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th]:text-start [&_td]:border [&_td]:px-2 [&_td]:py-1">
            <Markdown
              components={{
                a: ({ node, ...props }) => {
                  void node;
                  return (
                    <a
                      {...props}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    />
                  );
                },
              }}
            >
              {message.content}
            </Markdown>
          </div>
        )}

        {isUser && (
          <p className="mt-1 text-[10px] opacity-60">{t("message.userLabel")}</p>
        )}

        {!isUser && message.evidence.length > 0 && (
          <ChatEvidenceChips evidence={message.evidence} />
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MdPerson className="size-4" />
        </div>
      )}
    </div>
  );
}