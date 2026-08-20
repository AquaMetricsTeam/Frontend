import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { RecommendationStatus } from "../../constants/enums";

const STATUS_VALUES = ["all", "pending", "approved", "rejected"] as const;
type StatusFilter = (typeof STATUS_VALUES)[number];

const STATUS_PARAM_MAP: Record<StatusFilter, string | null> = {
  all: null,
  pending: String(RecommendationStatus.Pending),
  approved: String(RecommendationStatus.Approved),
  rejected: String(RecommendationStatus.Rejected),
};

const PARAM_TO_FILTER: Record<string, StatusFilter> = {
  "1": "pending",
  "2": "approved",
  "3": "rejected",
};

export default function RecommendationFilters() {
  const { t } = useTranslation("aiInbox");
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatusParam = searchParams.get("status");
  const currentFilter: StatusFilter = currentStatusParam
    ? (PARAM_TO_FILTER[currentStatusParam] ?? "all")
    : "all";

  const handleChange = (value: StatusFilter) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const param = STATUS_PARAM_MAP[value];
      if (param) {
        next.set("status", param);
      } else {
        next.delete("status");
      }
      next.delete("page");
      return next;
    });
  };

  return (
    <SegmentedControl
      options={STATUS_VALUES.map((v) => ({
        value: v,
        label: t(`filters.${v}`),
      }))}
      value={currentFilter}
      onChange={handleChange}
    />
  );
}
