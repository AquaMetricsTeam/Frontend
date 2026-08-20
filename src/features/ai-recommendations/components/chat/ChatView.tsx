import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessageResponse } from "../../types/index";
import { useChatSessions } from "../../hooks/useChatSessions";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useSendChatMessage } from "../../hooks/useSendChatMessage";
import ChatSessionSidebar from "./ChatSessionSidebar";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";
import ChatEmptyState from "./ChatEmptyState";
import NewChatDialog from "./NewChatDialog";

export default function ChatView() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [newChatOpen, setNewChatOpen] = useState(false);

  const sessionsQuery = useChatSessions({ pageNumber: 1, pageSize: 50 });
  const messagesQuery = useChatMessages(
    selectedSessionId ?? 0,
    !!selectedSessionId,
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = useSendChatMessage(selectedSessionId ?? 0, () => {
    scrollToBottom();
  });

  const handleSelectSession = useCallback((sessionId: number) => {
    setSelectedSessionId(sessionId);
  }, []);

  const handleChatCreated = useCallback(
    (sessionId: number) => {
      setSelectedSessionId(sessionId);
      sessionsQuery.refetch();
    },
    [sessionsQuery],
  );

  const handleSend = (message: string) => {
    if (!selectedSessionId) return;
    sendMessage.mutate({ message });
  };

  const baseMessages = messagesQuery.data?.data ?? [];

  const reply = sendMessage.data?.data;
  const replyMessages =
    reply && reply.session.id === selectedSessionId
      ? [reply.userMessage, reply.assistantMessage].filter(
          (m) => !baseMessages.some((bm) => bm.id === m.id),
        )
      : [];

  const optimisticMessage: ChatMessageResponse | null =
    sendMessage.isPending && sendMessage.variables
      ? {
          id: -1,
          chatSessionId: selectedSessionId!,
          role: "user" as const,
          content: sendMessage.variables.message,
          evidence: [],
          createdAt: new Date().toISOString(),
        }
      : null;

  const displayMessages = optimisticMessage
    ? [...baseMessages, ...replyMessages, optimisticMessage]
    : [...baseMessages, ...replyMessages];

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages.length, scrollToBottom]);

  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-border bg-background">
      <div className="w-80 shrink-0">
        <ChatSessionSidebar
          sessions={sessionsQuery.data?.data}
          isLoading={sessionsQuery.isLoading}
          selectedSessionId={selectedSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={() => setNewChatOpen(true)}
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        {!selectedSessionId && <ChatEmptyState />}

        {selectedSessionId && messagesQuery.isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        )}

        {selectedSessionId && !messagesQuery.isLoading && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="mx-auto max-w-3xl space-y-4">
                {displayMessages.map((msg) => (
                  <ChatMessageBubble key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="mx-auto w-full max-w-3xl">
              <ChatInput
                onSend={handleSend}
                disabled={!selectedSessionId}
                isSending={sendMessage.isPending}
              />
            </div>
          </>
        )}
      </div>

      <NewChatDialog
        open={newChatOpen}
        onOpenChange={setNewChatOpen}
        onCreated={handleChatCreated}
      />
    </div>
  );
}