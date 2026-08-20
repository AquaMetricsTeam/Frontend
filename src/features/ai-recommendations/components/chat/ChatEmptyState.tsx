import { useTranslation } from "react-i18next";
import { MdChatBubbleOutline } from "react-icons/md";

export default function ChatEmptyState() {
  const { t } = useTranslation("aiChat");

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-muted-foreground/40">
        <MdChatBubbleOutline size={56} />
      </div>
      <h3 className="mb-1 text-lg font-medium text-foreground">
        {t("empty.title")}
      </h3>
      <p className="max-w-md text-sm text-muted-foreground">
        {t("empty.description")}
      </p>
    </div>
  );
}
