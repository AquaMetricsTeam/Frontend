import { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  MdUnfoldMore,
  MdCheck,
  MdDeleteOutline,
  MdErrorOutline,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdDragIndicator,
} from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LabelField } from "@/components/fields/LabelField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMe } from "@/features/auth/hooks/useMe";
import { useExercisesLookup } from "@/features/lookups/hooks/useExercisesLookup";
import { useExercises } from "@/features/exercises/hooks/useExercises";
import { MUSCLE_GROUP_META, getMuscleGroupLabel } from "@/features/exercises/constants/muscleGroups";
import { SWIMMING_CATEGORY_META, getSwimmingCategoryLabel } from "@/features/exercises/constants/swimmingCategories";
import { useRepsLabel } from "@/components/common/RepsLabel";
import type { ExercisesStepFormValues } from "../../constants/validations";

const INTENSITY_OPTIONS = [
  {
    value: 1,
    labelKey: "intensity.low",
    defaultLabel: "Low",
    activeClass:
      "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/40 font-semibold shadow-2xs",
  },
  {
    value: 2,
    labelKey: "intensity.medium",
    defaultLabel: "Medium",
    activeClass:
      "bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/40 font-semibold shadow-2xs",
  },
  {
    value: 3,
    labelKey: "intensity.high",
    defaultLabel: "High",
    activeClass:
      "bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/40 font-semibold shadow-2xs",
  },
];

interface ExerciseRowProps {
  index: number;
  total: number;
  dragHandleProps?: Record<string, any> | null;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ExerciseRow({
  index,
  total,
  dragHandleProps,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ExerciseRowProps) {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useFormContext<ExercisesStepFormValues>();

  const { t } = useTranslation(["training", "exercises", "common"]);

  const { data: meData } = useMe();
  const roles = meData?.data?.roles ?? [];
  const isSwimmingCoach = roles.includes("SwimmingCoach");
  const isFitnessCoach = roles.includes("FitnessCoach");
  const canSwitchType =
    (!isSwimmingCoach && !isFitnessCoach) || roles.includes("Admin");

  const formFilterType = watch(`exercises.${index}.filterType`);
  const formCategory = watch(`exercises.${index}.category`);
  const formMuscleGroup = watch(`exercises.${index}.muscleGroup`);
  const formExerciseName = watch(`exercises.${index}.exerciseName`);
  const selectedId = watch(`exercises.${index}.exerciseId`);

  const hasCategory = typeof formCategory === "number" && formCategory > 0;
  const hasMuscleGroup =
    typeof formMuscleGroup === "number" && formMuscleGroup > 0;

  const initialFilterType =
    formFilterType ??
    (hasCategory
      ? "swimming"
      : hasMuscleGroup
        ? "fitness"
        : isSwimmingCoach && !isFitnessCoach
          ? "swimming"
          : "fitness");

  const initialFilterId =
    (initialFilterType === "swimming"
      ? hasCategory
        ? formCategory
        : null
      : hasMuscleGroup
        ? formMuscleGroup
        : null) ??
    (hasCategory ? formCategory : null) ??
    (hasMuscleGroup ? formMuscleGroup : null);

  const [filterType, setFilterType] = useState<"fitness" | "swimming">(
    initialFilterType,
  );
  const repsMeta = useRepsLabel({ type: filterType });
  const [filterId, setFilterId] = useState<number | null>(initialFilterId);

  const [filterOpen, setFilterOpen] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState(false);

  // Sync state if form values update (e.g. Back button in wizard or form reset)
  useEffect(() => {
    if (formFilterType) {
      setFilterType(formFilterType);
    }
    const cat =
      typeof formCategory === "number" && formCategory > 0
        ? formCategory
        : null;
    const mus =
      typeof formMuscleGroup === "number" && formMuscleGroup > 0
        ? formMuscleGroup
        : null;
    const currentId =
      (formFilterType === "swimming" ? cat : formFilterType === "fitness" ? mus : null) ??
      cat ??
      mus;
    if (currentId !== null && currentId !== undefined) {
      setFilterId(currentId);
    }
  }, [formFilterType, formCategory, formMuscleGroup]);

  // Fetch full exercise list for edit mode auto-detection
  const { data: allExercisesRes } = useExercises({ pageSize: 100 });
  const allExercises = allExercisesRes?.data?.items ?? [];

  // Edit mode: auto-detect muscleGroup / category if exerciseId is present but category/muscleGroup not saved
  useEffect(() => {
    if (selectedId > 0 && filterId === null && allExercises.length > 0) {
      const matched = allExercises.find((e) => e.id === selectedId);
      if (matched) {
        if (typeof matched.category === "number" && matched.category > 0) {
          setFilterType("swimming");
          setFilterId(matched.category);
          setValue(`exercises.${index}.category`, matched.category);
          setValue(`exercises.${index}.muscleGroup`, null);
          setValue(`exercises.${index}.filterType`, "swimming");
        } else if (
          typeof matched.muscleGroup === "number" &&
          matched.muscleGroup > 0
        ) {
          setFilterType("fitness");
          setFilterId(matched.muscleGroup);
          setValue(`exercises.${index}.muscleGroup`, matched.muscleGroup);
          setValue(`exercises.${index}.category`, null);
          setValue(`exercises.${index}.filterType`, "fitness");
        }
        if (matched.title) {
          setValue(`exercises.${index}.exerciseName`, matched.title);
        }
      }
    }
  }, [selectedId, filterId, allExercises, setValue, index]);

  // Lookup exercises filtered by selected muscle group / category
  const { data: lookupRes, isLoading: lookupLoading } = useExercisesLookup(
    {
      muscleGroup: filterType === "fitness" ? filterId : null,
      category: filterType === "swimming" ? filterId : null,
    },
    filterId !== null,
  );

  const exercises = lookupRes?.data ?? [];
  const selectedExercise =
    exercises.find((e) => e.id === selectedId) ||
    allExercises.find((e) => e.id === selectedId) ||
    (selectedId > 0 && formExerciseName
      ? { id: selectedId, title: formExerciseName }
      : null);

  const rowErrors = errors.exercises?.[index];

  // Options list based on type
  const filterOptions =
    filterType === "fitness"
      ? Object.entries(MUSCLE_GROUP_META).map(([val, meta]) => ({
          id: Number(val),
          label: getMuscleGroupLabel(Number(val), t),
          Icon: meta.Icon,
          colorVar: meta.colorVar,
        }))
      : Object.entries(SWIMMING_CATEGORY_META).map(([val, meta]) => ({
          id: Number(val),
          label: getSwimmingCategoryLabel(Number(val), t),
          Icon: meta.Icon,
          colorVar: meta.colorVar,
        }));

  const selectedFilterMeta = filterOptions.find((f) => f.id === filterId);

  function handleFilterChange(newId: number) {
    if (newId === filterId) return;
    setFilterId(newId);
    setFilterOpen(false);
    setValue(
      `exercises.${index}.category`,
      filterType === "swimming" ? newId : null,
    );
    setValue(
      `exercises.${index}.muscleGroup`,
      filterType === "fitness" ? newId : null,
    );
    setValue(`exercises.${index}.filterType`, filterType);
    // Clear exercise selection when filter changes
    setValue(`exercises.${index}.exerciseId`, 0, { shouldValidate: true });
    setValue(`exercises.${index}.exerciseName`, "");
  }

  function handleTypeChange(newType: "fitness" | "swimming") {
    if (newType === filterType) return;
    setFilterType(newType);
    setFilterId(null);
    setValue(`exercises.${index}.filterType`, newType);
    setValue(`exercises.${index}.category`, null);
    setValue(`exercises.${index}.muscleGroup`, null);
    setValue(`exercises.${index}.exerciseId`, 0);
    setValue(`exercises.${index}.exerciseName`, "");
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 space-y-3 relative group transition-all duration-150">
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <button
              type="button"
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors"
              title="Drag to reorder"
            >
              <MdDragIndicator className="size-4" />
            </button>
          )}
          <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
            {index + 1}
          </span>
          <span className="text-xs font-semibold text-foreground truncate max-w-44">
            {selectedExercise?.title || `Exercise #${index + 1}`}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === 0}
            onClick={onMoveUp}
            className="size-7 text-muted-foreground hover:text-foreground disabled:opacity-20"
            title="Move up"
          >
            <MdKeyboardArrowUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="size-7 text-muted-foreground hover:text-foreground disabled:opacity-20"
            title="Move down"
          >
            <MdKeyboardArrowDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ms-1 cursor-pointer"
            aria-label="Remove exercise"
            title="Remove exercise"
          >
            <MdDeleteOutline className="size-4" />
          </Button>
        </div>
      </div>

      {/* Card Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start ps-2">
        {/* ROW 1: Muscle Group or Category Filter Select */}
        <div className="col-span-12 sm:col-span-6 h-full">
          <LabelField
            label={
              <div className="flex items-center justify-between w-full">
                <span>
                  {filterType === "fitness"
                    ? t("exercises:filter.muscleGroup", { defaultValue: "العضلة المستهدفة" })
                    : t("exercises:filter.category", { defaultValue: "فئة السباحة" })}
                </span>
                {canSwitchType && (
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleTypeChange("fitness")}
                      className={cn(
                        "px-1.5 py-0.5 rounded font-medium transition-colors cursor-pointer",
                        filterType === "fitness"
                          ? "bg-primary/20 text-primary font-bold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t("common:nav.items.fitness", { defaultValue: "لياقة" })}
                    </button>
                    <span className="text-muted-foreground">/</span>
                    <button
                      type="button"
                      onClick={() => handleTypeChange("swimming")}
                      className={cn(
                        "px-1.5 py-0.5 rounded font-medium transition-colors cursor-pointer",
                        filterType === "swimming"
                          ? "bg-secondary-500/20 text-secondary-400 font-bold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t("common:nav.items.swimming", { defaultValue: "سباحة" })}
                    </button>
                  </div>
                )}
              </div>
            }
            className="h-full"
          >
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger
                type="button"
                className={cn(
                  "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-xs font-medium transition-colors cursor-pointer",
                  "hover:border-ring/50 focus:outline-none focus:ring-2 focus:ring-primary/40",
                  !selectedFilterMeta && "text-muted-foreground",
                )}
              >
                <span className="truncate flex items-center gap-2">
                  {selectedFilterMeta ? (
                    <>
                      <selectedFilterMeta.Icon
                        className="size-3.5 shrink-0"
                        style={{ color: selectedFilterMeta.colorVar }}
                      />
                      <span>{selectedFilterMeta.label}</span>
                    </>
                  ) : filterType === "fitness" ? (
                    t("training:wizard.step2.selectMuscleGroup")
                  ) : (
                    t("training:wizard.step2.selectSwimmingCategory")
                  )}
                </span>
                <MdUnfoldMore className="ms-2 size-4 shrink-0 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={
                      filterType === "fitness"
                        ? t("training:wizard.step2.searchMuscles")
                        : t("training:wizard.step2.searchCategories")
                    }
                    className="h-9 text-xs"
                  />
                  <CommandList>
                    <CommandEmpty className="py-2.5 text-xs text-center text-muted-foreground">
                      {t("common:noData.default", { defaultValue: "لا توجد نتائج" })}
                    </CommandEmpty>
                    <CommandGroup>
                      {filterOptions.map((opt) => (
                        <CommandItem
                          key={opt.id}
                          value={opt.label}
                          onSelect={() => handleFilterChange(opt.id)}
                          className="flex items-center justify-between text-xs cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <opt.Icon
                              className="size-3.5"
                              style={{ color: opt.colorVar }}
                            />
                            <span>{opt.label}</span>
                          </div>
                          {filterId === opt.id && (
                            <MdCheck className="size-4 text-primary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </LabelField>
        </div>

        {/* ROW 1: Exercise Select (Disabled until filter picked) */}
        <div className="col-span-12 sm:col-span-6 h-full">
          <Controller
            name={`exercises.${index}.exerciseId`}
            control={control}
            render={({ field }) => {
              const isDisabled = filterId === null;
              const isSelected = selectedId > 0 && selectedExercise;

              return (
                <LabelField
                  htmlFor={`exercises.${index}.exerciseId`}
                  label={t("training:wizard.step2.exerciseLabel", { defaultValue: "التمرين" })}
                  className="h-full"
                >
                  <Popover
                    open={exerciseOpen && !isDisabled}
                    onOpenChange={(op) => {
                      if (!isDisabled) setExerciseOpen(op);
                    }}
                  >
                    <PopoverTrigger
                      id={`exercises.${index}.exerciseId`}
                      type="button"
                      disabled={isDisabled}
                      className={cn(
                        "flex h-9 w-full items-center mt-auto justify-between rounded-lg border border-input bg-background px-3 text-xs font-medium transition-colors cursor-pointer",
                        "hover:border-ring/50 focus:outline-none focus:ring-2 focus:ring-primary/40",
                        isDisabled &&
                          "cursor-not-allowed opacity-60 bg-muted/40",
                        !isSelected && "text-muted-foreground",
                        rowErrors?.exerciseId &&
                          (!field.value || field.value === 0) &&
                          "border-destructive focus:ring-destructive/40",
                      )}
                    >
                      <span className="truncate text-start">
                        {isDisabled
                          ? t("training:wizard.step2.chooseFilterFirst", {
                              type:
                                filterType === "fitness"
                                  ? t("exercises:filter.muscleGroup", { defaultValue: "العضلة" })
                                  : t("exercises:filter.category", { defaultValue: "الفئة" }),
                              defaultValue: "اختر التصنيف أولاً...",
                            })
                          : isSelected
                            ? selectedExercise.title
                            : t("training:wizard.step2.selectExercise")}
                      </span>
                      <MdUnfoldMore className="ms-2 size-4 shrink-0 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder={t("training:wizard.step2.searchExercises")}
                          className="h-9 text-xs"
                        />
                        <CommandList>
                          <CommandEmpty className="py-2.5 text-xs text-center text-muted-foreground">
                            {lookupLoading
                              ? t("common:loading", { defaultValue: "جارٍ التحميل..." })
                              : t("training:wizard.step2.noExercisesFound")}
                          </CommandEmpty>
                          <CommandGroup>
                            {exercises.map((ex) => (
                              <CommandItem
                                key={ex.id}
                                value={ex.title}
                                onSelect={() => {
                                  field.onChange(ex.id);
                                  setValue(
                                    `exercises.${index}.exerciseName`,
                                    ex.title,
                                  );
                                  setValue(
                                    `exercises.${index}.filterType`,
                                    filterType,
                                  );
                                  if (filterType === "swimming") {
                                    setValue(
                                      `exercises.${index}.category`,
                                      filterId,
                                    );
                                    setValue(
                                      `exercises.${index}.muscleGroup`,
                                      null,
                                    );
                                  } else {
                                    setValue(
                                      `exercises.${index}.muscleGroup`,
                                      filterId,
                                    );
                                    setValue(
                                      `exercises.${index}.category`,
                                      null,
                                    );
                                  }
                                  clearErrors(`exercises.${index}.exerciseId`);
                                  setExerciseOpen(false);
                                }}
                                className="flex items-center justify-between text-xs cursor-pointer"
                              >
                                <span>{ex.title}</span>
                                {field.value === ex.id && (
                                  <MdCheck className="size-4 text-primary" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {rowErrors?.exerciseId &&
                    (!field.value || field.value === 0) && (
                      <div className="flex items-center gap-1 text-[10px] text-destructive mt-1">
                        <MdErrorOutline className="size-3" />
                        <span>
                          {t("wizard.step2.exerciseRequired", {
                            defaultValue: "Exercise is required",
                          })}
                        </span>
                      </div>
                    )}
                </LabelField>
              );
            }}
          />
        </div>

        {/* ROW 2: Sets */}
        <div className="col-span-6 sm:col-span-2 h-full">
          <LabelField
            htmlFor={`exercises.${index}.sets`}
            label={t("wizard.step2.sets", { defaultValue: "Sets" })}
            className="h-full"
          >
            <Input
              id={`exercises.${index}.sets`}
              type="number"
              min={1}
              placeholder="3"
              className="h-9 text-xs mt-auto"
              {...register(`exercises.${index}.sets`, { valueAsNumber: true })}
            />
          </LabelField>
        </div>

        {/* ROW 2: Reps / Meters */}
        <div className="col-span-6 sm:col-span-2 h-full">
          <LabelField
            htmlFor={`exercises.${index}.reps`}
            label={repsMeta.label}
            className="h-full"
          >
            <Input
              id={`exercises.${index}.reps`}
              type="number"
              min={0}
              placeholder={filterType === "swimming" ? "100" : "10"}
              className="h-9 text-xs mt-auto"
              {...register(`exercises.${index}.reps`, { valueAsNumber: true })}
            />
          </LabelField>
        </div>

        {/* ROW 2: Duration (Min) */}
        <div className="col-span-6 sm:col-span-2 h-full">
          <LabelField
            htmlFor={`exercises.${index}.duration`}
            label={t("wizard.step2.minutes", {
              defaultValue: "Duration (min)",
            })}
            className="h-full"
          >
            <Input
              id={`exercises.${index}.duration`}
              type="number"
              min={0}
              placeholder="0"
              className="h-9 text-xs mt-auto"
              {...register(`exercises.${index}.duration`, {
                valueAsNumber: true,
              })}
            />
          </LabelField>
        </div>

        {/* ROW 2: Rest (Sec) */}
        <div className="col-span-6 sm:col-span-3 h-full">
          <LabelField
            htmlFor={`exercises.${index}.restSeconds`}
            label={t("wizard.step2.rest", { defaultValue: "Rest (sec)" })}
            className="h-full"
          >
            <Input
              id={`exercises.${index}.restSeconds`}
              type="number"
              min={0}
              placeholder="30"
              className="h-9 text-xs mt-auto"
              {...register(`exercises.${index}.restSeconds`, {
                valueAsNumber: true,
              })}
            />
          </LabelField>
        </div>

        {/* ROW 2: Rest After (Sec) */}
        <div className="col-span-6 sm:col-span-3 h-full">
          <LabelField
            htmlFor={`exercises.${index}.restAfter`}
            label={t("wizard.step2.restAfter", {
              defaultValue: "Rest After (sec)",
            })}
            className="h-full"
          >
            <Input
              id={`exercises.${index}.restAfter`}
              type="number"
              min={0}
              placeholder="0"
              className="h-9 text-xs mt-auto"
              {...register(`exercises.${index}.restAfter`, {
                valueAsNumber: true,
              })}
            />
          </LabelField>
        </div>

        {/* ROW 2: Segmented Intensity Control */}
        <div className="col-span-12  h-full">
          <Controller
            name={`exercises.${index}.intensity`}
            control={control}
            render={({ field }) => {
              const currentVal = field.value ?? 2;
              return (
                <LabelField
                  label={t("wizard.step2.intensity", {
                    defaultValue: "Intensity",
                  })}
                  className="h-full"
                >
                  <div className="flex items-center mt-auto gap-0.5 p-0.5 rounded-lg border border-input bg-background h-9">
                    {INTENSITY_OPTIONS.map((opt) => {
                      const isSelected = currentVal === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "flex-1 h-7 rounded-md text-[11px] font-medium transition-all duration-150 flex items-center justify-center cursor-pointer px-0.5",
                            isSelected
                              ? opt.activeClass
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                          )}
                        >
                          {t(opt.labelKey, { defaultValue: opt.defaultLabel })}
                        </button>
                      );
                    })}
                  </div>
                </LabelField>
              );
            }}
          />
        </div>

        {/* ROW 3: Notes / Instructions (Full Width) */}
        <div className="col-span-12">
          <LabelField
            htmlFor={`exercises.${index}.notes`}
            label={t("wizard.step2.notes", {
              defaultValue: "Notes / Instructions",
            })}
          >
            <Textarea
              id={`exercises.${index}.notes`}
              rows={2}
              placeholder={t("wizard.step2.notesPlaceholder", { defaultValue: "تعليمات أو ملاحظات على التمرين (اختياري)..." })}
              className="min-h-14 text-xs resize-y bg-background"
              {...register(`exercises.${index}.notes`)}
            />
          </LabelField>
        </div>
      </div>
    </div>
  );
}
