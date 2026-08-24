import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { MdAutoAwesome, MdOpenInNew } from "react-icons/md";
import { useAiGeneration } from "../../context/AiGenerationContext";
import { cn } from "@/lib/utils";

export function GlobalAiGeneratingWidget() {
  const { t } = useTranslation("aiPlan");
  const { isGenerating, athleteName } = useAiGeneration();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isGenerating) return null;

  const isAlreadyOnGeneratePage = location.pathname === "/ai-generate-plan";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 end-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-3rem)]",
        "animate-in fade-in slide-in-from-bottom-5 duration-300",
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card/90 dark:bg-card/95 p-4 shadow-2xl backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-primary/10">
        {/* Shimmering Top Progress Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-primary/20 overflow-hidden">
          <div className="h-full w-1/2 bg-primary rounded-full animate-[shimmer_1.5s_infinite_linear] bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
        </div>

        <div className="flex items-start gap-3.5">
          {/* Animated Glowing AI Icon */}
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
            <span className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-30" />
            <MdAutoAwesome className="size-5 animate-pulse text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-primary animate-ping" />
              <h4 className="text-xs font-bold text-foreground truncate">
                {t("generate.generatingBackground", {
                  defaultValue: "Generating AI Plan...",
                })}
              </h4>
            </div>

            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {athleteName
                ? t("generate.generatingFor", {
                    name: athleteName,
                    defaultValue: `Generating for ${athleteName}...`,
                  })
                : t("generate.description", {
                    defaultValue: "AI is creating training plan...",
                  })}
            </p>

            <p className="text-[10px] text-primary/80 mt-1 font-medium">
              {t("generate.generatingNotice", {
                defaultValue: "You can navigate freely while plan generates.",
              })}
            </p>
          </div>

          {!isAlreadyOnGeneratePage && (
            <button
              type="button"
              onClick={() => navigate("/ai-generate-plan")}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0 cursor-pointer"
              title={t("generate.title", { defaultValue: "Go to generate page" })}
              aria-label={t("generate.title", { defaultValue: "Go to generate page" })}
            >
              <MdOpenInNew className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalAiGeneratingWidget;
