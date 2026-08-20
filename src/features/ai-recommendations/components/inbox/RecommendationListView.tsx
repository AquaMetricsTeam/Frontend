import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMe } from "@/features/auth/hooks/useMe";
import { useRecommendations } from "../../hooks/useRecommendations";
import { ROLE_DOMAIN_MAP } from "../../constants/enums";
import WithLoadingAndError from "@/components/HOCs/WithLoadingAndError";
import WithPagination from "@/components/HOCs/WithPagination";
import RecommendationListItem from "./RecommendationListItem";

const PAGE_SIZE = 10;

export default function RecommendationListView() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation("aiInbox");

  const { data: meRes } = useMe();
  const user = meRes?.data;
  const primaryRole = user?.roles?.[0] ?? "";
  const domainId = ROLE_DOMAIN_MAP[primaryRole];

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const statusParam = searchParams.get("status");

  const query = useRecommendations({
    domainId,
    pageNumber: page,
    pageSize: PAGE_SIZE,
  });

  const pagedData = query.data?.data;
  const allItems = pagedData?.items ?? [];
  const totalPages = pagedData?.totalPages ?? 0;

  const items = statusParam
    ? allItems.filter((item) => String(item.status) === statusParam)
    : allItems;

  return (
    <WithLoadingAndError
      isLoading={query.isLoading}
      isError={query.isError}
      hasNoData={!query.isLoading && !query.isError && items.length === 0}
      noDataMessageProps={{
        messageKey: "aiInbox:list.noRecommendations",
        descriptionKey: "aiInbox:list.noRecommendationsDescription",
      }}
    >
      <WithPagination pageCount={totalPages}>
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">
            {t("page.count", { count: items.length })}
          </p>
          {items.map((item) => (
            <RecommendationListItem key={item.id} item={item} />
          ))}
        </div>
      </WithPagination>
    </WithLoadingAndError>
  );
}
