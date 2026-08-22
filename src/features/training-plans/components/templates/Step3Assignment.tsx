import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdGroup, MdCheck } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAvailableAthletesLookup } from "@/features/lookups/hooks/useAvailableAthletesLookup";
import { useGroupsLookup } from "@/features/lookups/hooks/useGroupsLookup";
import {
  assignmentStepSchema,
  type AssignmentStepFormValues,
} from "../../constants/validations";

interface Step3AssignmentProps {
  defaultValues?: Partial<AssignmentStepFormValues>;
  onNext: (data: AssignmentStepFormValues) => void;
  onBack: () => void;
}

export function Step3Assignment({
  defaultValues,
  onNext,
  onBack,
}: Step3AssignmentProps) {
  const { t } = useTranslation("training");
  const form = useForm<AssignmentStepFormValues>({
    resolver: zodResolver(assignmentStepSchema),
    defaultValues: {
      assignNow: false,
      athleteIds: [],
      groupIds: [],
      ...defaultValues,
    },
  });

  const assignNow = form.watch("assignNow");
  const athleteIds = form.watch("athleteIds");
  const groupIds = form.watch("groupIds");

  const { data: athleteRes } = useAvailableAthletesLookup(assignNow);
  const { data: groupRes } = useGroupsLookup(assignNow);

  const athletes = athleteRes?.data ?? [];
  const groups = groupRes?.data ?? [];

  function toggleAthlete(id: string) {
    const current = form.getValues("athleteIds");
    const next = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    form.setValue("athleteIds", next, { shouldValidate: true });
  }

  function toggleGroup(id: number) {
    const current = form.getValues("groupIds");
    const next = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    form.setValue("groupIds", next, { shouldValidate: true });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-5 flex-1 pt-4">
        <div className="flex flex-col gap-4 flex-1">
          {/* Radio choice */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => form.setValue("assignNow", false)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-start transition-all duration-200 cursor-pointer",
                !assignNow
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-sm font-semibold">{t("wizard.step3.saveAsTemplate")}</span>
              <span className="text-xs opacity-75">
                {t("wizard.step3.saveAsTemplateDesc")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => form.setValue("assignNow", true)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-start transition-all duration-200 cursor-pointer",
                assignNow
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-sm font-semibold">{t("wizard.step3.saveAndAssign")}</span>
              <span className="text-xs opacity-75">
                {t("wizard.step3.saveAndAssignDesc")}
              </span>
            </button>
          </div>

          {/* Target lists if assignNow */}
          {assignNow && (
            <div className="space-y-4 pt-2">
              {/* Groups */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("assign.groups")}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {groups.map((group) => {
                    const isSelected = groupIds.includes(group.id);
                    return (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg p-2.5 border text-xs font-medium transition-all text-start cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary/8 text-primary"
                            : "border-border text-muted-foreground hover:bg-accent",
                        )}
                      >
                        <MdGroup className="size-4 shrink-0" />
                        <span className="flex-1 truncate">{group.name}</span>
                        {group.athleteCount !== undefined && (
                          <Badge variant="secondary" className="text-[10px]">
                            {group.athleteCount}
                          </Badge>
                        )}
                        {isSelected && <MdCheck className="size-3.5 shrink-0 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Athletes */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("assign.athletes")}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {athletes.length === 0 ? (
                    <p className="col-span-2 py-4 text-center text-xs text-muted-foreground">
                      {t("assignments.noAthletesAvailable")}
                    </p>
                  ) : (
                    athletes.map((athlete) => {
                      const isSelected = athleteIds.includes(athlete.athleteId);
                      return (
                        <button
                          key={athlete.athleteId}
                          type="button"
                          onClick={() => toggleAthlete(athlete.athleteId)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg p-2.5 border text-xs font-medium transition-all text-start cursor-pointer",
                            isSelected
                              ? "border-primary bg-primary/8 text-primary"
                              : "border-border text-muted-foreground hover:bg-accent",
                          )}
                        >
                          <Avatar className="size-6 shrink-0">
                            <AvatarImage src={athlete.profilePictureUrl ?? undefined} />
                            <AvatarFallback className="text-[10px]">
                              {athlete.fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 truncate">{athlete.fullName}</span>
                          {isSelected && <MdCheck className="size-3.5 shrink-0 text-primary" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onBack} className="cursor-pointer">
            {t("wizard.step2.back")}
          </Button>
          <Button type="submit" className="min-w-32 cursor-pointer">
            {t("wizard.step3.next")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
