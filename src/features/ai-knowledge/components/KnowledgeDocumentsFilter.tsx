import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { KNOWLEDGE_DOMAINS } from "../constants/enums";

const ALL = "all" as const;

export default function KnowledgeDocumentsFilter() {
  const { t } = useTranslation("aiKnowledge");
  const [searchParams, setSearchParams] = useSearchParams();

  const domainParam = searchParams.get("domain");
  const currentFilter =
    domainParam && KNOWLEDGE_DOMAINS.some((d) => String(d.id) === domainParam)
      ? domainParam
      : ALL;

  const options = [
    { value: ALL, label: t("filters.all") },
    ...KNOWLEDGE_DOMAINS.map((d) => ({
      value: String(d.id),
      label: t(d.labelKey),
    })),
  ];

  const handleChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === ALL) {
        next.delete("domain");
      } else {
        next.set("domain", value);
      }
      return next;
    });
  };

  return (
    <SegmentedControl
      options={options}
      value={currentFilter}
      onChange={handleChange}
    />
  );
}