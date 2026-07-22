import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FiInbox } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface NoDataProps {
  messageKey?: TranslationKey;
  descriptionKey?: TranslationKey;
  icon?: ReactNode;
  className?: string;
  iconClassName?: string;
  messageClassName?: string;
  descriptionClassName?: string;
}

function NoData({
  messageKey = "common:noData.default",
  descriptionKey = "common:noData.description",
  className = "",
  icon = <FiInbox size={50} />,
  iconClassName = "",
  messageClassName = "",
  descriptionClassName = "",
}: NoDataProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      <div className={cn("mb-4 text-neutral-400", iconClassName)}>{icon}</div>
      <h3
        className={cn(
          "mb-1 text-lg font-medium text-neutral-900",
          messageClassName,
        )}
      >
        {t(messageKey)}
      </h3>
      <p
        className={cn(
          "max-w-md text-sm text-neutral-500",
          descriptionClassName,
        )}
      >
        {t(descriptionKey)}
      </p>
    </div>
  );
}

export default NoData;
