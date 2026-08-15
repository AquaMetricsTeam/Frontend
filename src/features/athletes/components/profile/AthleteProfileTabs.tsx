import { useTranslation } from "react-i18next";
import {
  MdInsights,
  MdPool,
  MdFitnessCenter,
  MdAssignment,
  MdMedicalServices,
  MdGroups,
} from "react-icons/md";

export type AthleteProfileTabKey =
  | "overview"
  | "swimming"
  | "fitness"
  | "plans"
  | "medical"
  | "coaches";

interface AthleteProfileTabsProps {
  activeTab: AthleteProfileTabKey;
  onChangeTab: (tab: AthleteProfileTabKey) => void;
}

export function AthleteProfileTabs({
  activeTab,
  onChangeTab,
}: AthleteProfileTabsProps) {
  const { t } = useTranslation("athletes");

  const tabs: {
    key: AthleteProfileTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: "overview",
      label: t("profile.tabs.overview"),
      icon: MdInsights,
    },
    {
      key: "swimming",
      label: t("profile.tabs.swimming"),
      icon: MdPool,
    },
    {
      key: "fitness",
      label: t("profile.tabs.fitness"),
      icon: MdFitnessCenter,
    },
    {
      key: "plans",
      label: t("profile.tabs.trainingPlans"),
      icon: MdAssignment,
    },
    {
      key: "medical",
      label: t("profile.tabs.medical"),
      icon: MdMedicalServices,
    },
    {
      key: "coaches",
      label: t("profile.tabs.coaches"),
      icon: MdGroups,
    },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-card border border-border/80 w-fit min-w-full sm:min-w-0 shadow-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon
                className={`size-4 ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
