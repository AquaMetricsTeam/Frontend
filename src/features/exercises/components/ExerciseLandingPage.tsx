import { useNavigate } from "react-router-dom";
import { useMe } from "@/features/auth/hooks/useMe";
import { Dumbbell, Waves } from "lucide-react";
import { MuscleGroup, SwimmingExerciseCategory } from "../types/index";
import { MUSCLE_GROUP_META } from "../constants/muscleGroups";
import { SWIMMING_CATEGORY_META } from "../constants/swimmingCategories";
import { ExerciseCategoryCard } from "./ExerciseCategoryCard";

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  colorVar,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  colorVar: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="flex size-9 items-center justify-center rounded-xl"
        style={{
          background: `color-mix(in oklch, ${colorVar} 15%, transparent)`,
        }}
      >
        <Icon
          className="size-5"
          style={{ color: colorVar }}
          strokeWidth={1.75}
        />
      </span>
      <div>
        <h2 className="text-base font-bold text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

export function ExerciseLandingPage() {
  const navigate = useNavigate();
  const { data: meData } = useMe();
  const roles = meData?.data?.roles ?? [];

  const isFitness = roles.includes("FitnessCoach");
  const isSwimming = roles.includes("SwimmingCoach");
  const showBoth = (!isFitness && !isSwimming) || roles.includes("Admin");

  const muscleEntries = Object.values(MuscleGroup).filter(
    (v): v is MuscleGroup => typeof v === "number",
  );
  const swimmingEntries = Object.values(SwimmingExerciseCategory).filter(
    (v): v is SwimmingExerciseCategory => typeof v === "number",
  );

  return (
    <div className="flex flex-col gap-10">
      {(isFitness || showBoth) && (
        <section>
          <SectionHeader
            icon={Dumbbell}
            title="Muscle Groups"
            subtitle="Select a muscle group to browse fitness exercises"
            colorVar="var(--primary-400)"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {muscleEntries.map((group) => {
              const meta = MUSCLE_GROUP_META[group];
              return (
                <ExerciseCategoryCard
                  key={group}
                  label={meta.label}
                  Icon={meta.Icon}
                  colorVar={meta.colorVar}
                  onClick={() => navigate(`/exercises/muscle/${group}`)}
                />
              );
            })}
          </div>
        </section>
      )}

      {(isSwimming || showBoth) && (
        <section>
          <SectionHeader
            icon={Waves}
            title="Swimming Categories"
            subtitle="Select a category to browse swimming exercises"
            colorVar="var(--secondary-400)"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {swimmingEntries.map((cat) => {
              const meta = SWIMMING_CATEGORY_META[cat];
              return (
                <ExerciseCategoryCard
                  key={cat}
                  label={meta.label}
                  Icon={meta.Icon}
                  colorVar={meta.colorVar}
                  onClick={() => navigate(`/exercises/category/${cat}`)}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
