import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/common/SearchInput";
import NoData from "@/components/feedbacks/NoData";
import type { ChatSessionResponse, PagedResponse } from "../../types/index";
import ChatSessionItem from "./ChatSessionItem";

interface ChatSessionSidebarProps {
  sessions: PagedResponse<ChatSessionResponse> | undefined;
  isLoading: boolean;
  selectedSessionId: number | null;
  onSelectSession: (sessionId: number) => void;
  onNewChat: () => void;
}

export default function ChatSessionSidebar({
  sessions,
  isLoading,
  selectedSessionId,
  onSelectSession,
  onNewChat,
}: ChatSessionSidebarProps) {
  const { t } = useTranslation("aiChat");
  const [search, setSearch] = useState("");

  const items = sessions?.items ?? [];
  const filtered = search
    ? items.filter((s) => {
        const q = search.toLowerCase();
        const name = (s.title ?? s.athleteName ?? "").toLowerCase();
        return name.includes(q);
      })
    : items;

  return (
    <div className="flex h-full flex-col border-e border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          {t("sidebar.title")}
        </h3>
        <Button
          size="sm"
          onClick={onNewChat}
          className="gap-1 cursor-pointer"
        >
          <MdAdd className="size-4" />
          {t("sidebar.newChat")}
        </Button>
      </div>

      <div className="px-3 py-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("sidebar.search")}
          className="w-full sm:max-w-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b border-border px-4 py-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <NoData
            messageKey="common:noData.default"
            descriptionKey="common:noData.description"
            className="py-8"
          />
        )}

        {!isLoading &&
          filtered.map((session) => (
            <ChatSessionItem
              key={session.id}
              session={session}
              isSelected={session.id === selectedSessionId}
              onClick={() => onSelectSession(session.id)}
            />
          ))}
      </div>
    </div>
  );
}
