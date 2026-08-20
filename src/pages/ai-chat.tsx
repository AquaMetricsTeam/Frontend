import { useTranslation } from "react-i18next";
import PageWrapper from "@/components/layouts/PageWrapper";
import ChatView from "@/features/ai-recommendations/components/chat/ChatView";

export default function AiChatPage() {
  const { t } = useTranslation("aiChat");

  return (
    <PageWrapper>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">
          {t("page.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("page.description")}
        </p>
      </div>

      <div className="flex-1 overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
        <ChatView />
      </div>
    </PageWrapper>
  );
}
