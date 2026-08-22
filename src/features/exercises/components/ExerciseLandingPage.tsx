import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMe } from "@/features/auth/hooks/useMe";
import { Dumbbell, Waves, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MuscleGroup, SwimmingExerciseCategory } from "../types/index";
import {
  MUSCLE_GROUP_META,
  getMuscleGroupLabel,
  getMuscleGroupTag,
  getMuscleGroupSublabel,
  type MuscleGroupCategory,
} from "../constants/muscleGroups";
import {
  SWIMMING_CATEGORY_META,
  getSwimmingCategoryLabel,
  getSwimmingCategoryTag,
  getSwimmingCategorySublabel,
  type SwimmingCategoryGroup,
} from "../constants/swimmingCategories";
import { ExerciseCategoryCard } from "./ExerciseCategoryCard";

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  count: number;
  colorVar: string;
  iconBgClass?: string;
  iconTextClass?: string;
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  count,
  colorVar,
  iconBgClass,
  iconTextClass,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 items-center justify-center rounded-xl border ${iconBgClass || "bg-primary/10 border-primary/20"}`}
          style={
            !iconBgClass
              ? {
                  background: `color-mix(in oklch, ${colorVar} 15%, transparent)`,
                  borderColor: `color-mix(in oklch, ${colorVar} 30%, transparent)`,
                }
              : undefined
          }
        >
          <Icon
            className={`size-5 ${iconTextClass || "text-primary"}`}
            style={!iconTextClass ? { color: colorVar } : undefined}
            strokeWidth={1.85}
          />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground leading-tight font-display">
              {title}
            </h2>
            <Badge
              variant="outline"
              className="text-xs font-semibold px-2 py-0.5 rounded-full border-border/70 bg-card/60"
            >
              {count}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export function ExerciseLandingPage() {
  const { t } = useTranslation("exercises");
  const navigate = useNavigate();
  const { data: meData } = useMe();
  const roles = meData?.data?.roles ?? [];

  const isFitness = roles.includes("FitnessCoach");
  const isSwimming = roles.includes("SwimmingCoach");
  const showBoth = (!isFitness && !isSwimming) || roles.includes("Admin");

  const [searchQuery, setSearchQuery] = useState("");
  const [swimmingFilter, setSwimmingFilter] = useState<"all" | SwimmingCategoryGroup>("all");
  const [muscleFilter, setMuscleFilter] = useState<"all" | MuscleGroupCategory>("all");

  const allMuscleEntries = useMemo(
    () =>
      Object.values(MuscleGroup).filter(
        (v): v is MuscleGroup => typeof v === "number",
      ),
    [],
  );

  const allSwimmingEntries = useMemo(
    () =>
      Object.values(SwimmingExerciseCategory).filter(
        (v): v is SwimmingExerciseCategory => typeof v === "number",
      ),
    [],
  );

  const filteredSwimmingEntries = useMemo(() => {
    return allSwimmingEntries.filter((cat) => {
      const meta = SWIMMING_CATEGORY_META[cat];
      if (swimmingFilter !== "all" && meta.group !== swimmingFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const label = getSwimmingCategoryLabel(cat, t).toLowerCase();
        const sublabel = getSwimmingCategorySublabel(cat, t).toLowerCase();
        const tag = getSwimmingCategoryTag(cat, t).toLowerCase();
        return label.includes(query) || sublabel.includes(query) || tag.includes(query);
      }
      return true;
    });
  }, [allSwimmingEntries, swimmingFilter, searchQuery, t]);

  const filteredMuscleEntries = useMemo(() => {
    return allMuscleEntries.filter((group) => {
      const meta = MUSCLE_GROUP_META[group];
      if (muscleFilter !== "all" && meta.group !== muscleFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const label = getMuscleGroupLabel(group, t).toLowerCase();
        const sublabel = getMuscleGroupSublabel(group, t).toLowerCase();
        const tag = getMuscleGroupTag(group, t).toLowerCase();
        return label.includes(query) || sublabel.includes(query) || tag.includes(query);
      }
      return true;
    });
  }, [allMuscleEntries, muscleFilter, searchQuery, t]);

  const swimmingCounts = useMemo(() => {
    const strokes = allSwimmingEntries.filter((c) => SWIMMING_CATEGORY_META[c].group === "strokes").length;
    const skills = allSwimmingEntries.filter((c) => SWIMMING_CATEGORY_META[c].group === "skills").length;
    const energy = allSwimmingEntries.filter((c) => SWIMMING_CATEGORY_META[c].group === "energy").length;
    return { all: allSwimmingEntries.length, strokes, skills, energy };
  }, [allSwimmingEntries]);

  const muscleCounts = useMemo(() => {
    const upperBody = allMuscleEntries.filter((m) => MUSCLE_GROUP_META[m].group === "upperBody").length;
    const lowerBody = allMuscleEntries.filter((m) => MUSCLE_GROUP_META[m].group === "lowerBody").length;
    const coreFull = allMuscleEntries.filter((m) => MUSCLE_GROUP_META[m].group === "coreFull").length;
    return { all: allMuscleEntries.length, upperBody, lowerBody, coreFull };
  }, [allMuscleEntries]);

  return (
    <div className="flex flex-col gap-10">
      {/* Quick Search Bar */}
      <div className="relative max-w-md w-full">
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("filters.searchPlaceholder", { defaultValue: "Search categories..." })}
          className="w-full h-10 ps-10 pe-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-xs text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-xs"
        />
      </div>

      {/* Swimming Categories Section */}
      {(isSwimming || showBoth) && (
        <section className="space-y-4">
          <SectionHeader
            icon={Waves}
            title={t("sections.swimmingCategoriesTitle")}
            subtitle={t("sections.swimmingCategoriesSubtitle")}
            count={allSwimmingEntries.length}
            colorVar="var(--primary-400)"
            iconBgClass="bg-cyan-500/10 border-cyan-500/20"
            iconTextClass="text-cyan-400"
          />

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            <button
              type="button"
              onClick={() => setSwimmingFilter("all")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                swimmingFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{t("filters.all", { defaultValue: "All" })}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${swimmingFilter === "all" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {swimmingCounts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSwimmingFilter("strokes")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                swimmingFilter === "strokes"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{t("filters.strokes", { defaultValue: "Strokes & Medley" })}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${swimmingFilter === "strokes" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {swimmingCounts.strokes}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSwimmingFilter("skills")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                swimmingFilter === "skills"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{t("filters.skills", { defaultValue: "Skills & Drills" })}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${swimmingFilter === "skills" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {swimmingCounts.skills}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSwimmingFilter("energy")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                swimmingFilter === "energy"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{t("filters.energy", { defaultValue: "Energy & Pacing" })}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${swimmingFilter === "energy" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {swimmingCounts.energy}
              </span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
            {filteredSwimmingEntries.map((cat) => {
              const meta = SWIMMING_CATEGORY_META[cat];
              const label = getSwimmingCategoryLabel(cat, t);
              const tag = getSwimmingCategoryTag(cat, t);
              const sublabel = getSwimmingCategorySublabel(cat, t);

              return (
                <ExerciseCategoryCard
                  key={cat}
                  label={label}
                  tag={tag}
                  sublabel={sublabel}
                  Icon={meta.Icon}
                  colorVar={meta.colorVar}
                  accentClass={meta.accentClass}
                  iconBgClass={meta.iconBgClass}
                  glowColor={meta.glowColor}
                  onClick={() => navigate(`/exercises/category/${cat}`)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Muscle Groups Section */}
      {(isFitness || showBoth) && (
        <section className="space-y-4">
          <SectionHeader
            icon={Dumbbell}
            title={t("sections.muscleGroupsTitle")}
            subtitle={t("sections.muscleGroupsSubtitle")}
            count={allMuscleEntries.length}
            colorVar="var(--primary-400)"
            iconBgClass="bg-rose-500/10 border-rose-500/20"
            iconTextClass="text-rose-400"
          />

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            <button
              type="button"
              onClick={() => setMuscleFilter("all")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                muscleFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{t("filters.all", { defaultValue: "All" })}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${muscleFilter === "all" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {muscleCounts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMuscleFilter("upperBody")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                muscleFilter === "upperBody"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{t("filters.upperBody", { defaultValue: "Upper Body" })}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${muscleFilter === "upperBody" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {muscleCounts.upperBody}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMuscleFilter("lowerBody")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                muscleFilter === "lowerBody"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{t("filters.lowerBody", { defaultValue: "Lower Body" })}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${muscleFilter === "lowerBody" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {muscleCounts.lowerBody}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMuscleFilter("coreFull")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                muscleFilter === "coreFull"
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/20"
                  : "bg-card/70 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{t("filters.coreFull", { defaultValue: "Core & Full Body" })}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${muscleFilter === "coreFull" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {muscleCounts.coreFull}
              </span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
            {filteredMuscleEntries.map((group) => {
              const meta = MUSCLE_GROUP_META[group];
              const label = getMuscleGroupLabel(group, t);
              const tag = getMuscleGroupTag(group, t);
              const sublabel = getMuscleGroupSublabel(group, t);

              return (
                <ExerciseCategoryCard
                  key={group}
                  label={label}
                  tag={tag}
                  sublabel={sublabel}
                  Icon={meta.Icon}
                  colorVar={meta.colorVar}
                  accentClass={meta.accentClass}
                  iconBgClass={meta.iconBgClass}
                  glowColor={meta.glowColor}
                  onClick={() => navigate(`/exercises/muscle/${group}`)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

