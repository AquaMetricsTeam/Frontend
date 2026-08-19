import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MdHealing } from "react-icons/md";
import { SelectField } from "@/components/fields/SelectField";
import { TextareaField } from "@/components/fields/TextareaField";
import {
  INJURY_BODY_PART_OPTIONS,
  INJURY_TYPE_OPTIONS,
} from "../constants/injury";
import { cn } from "@/lib/utils";

interface InjuryFormFieldsProps {
  className?: string;
  prefix?: string;
}

export function InjuryFormFields({
  className,
  prefix = "",
}: InjuryFormFieldsProps) {
  const { t } = useTranslation("training");
  const { watch } = useFormContext();

  const getFieldName = (field: string) =>
    (prefix ? `${prefix}.${field}` : field) as any;

  const injuryOccurred = watch(getFieldName("injuryOccurred"));

  if (!injuryOccurred) return null;

  const injuryTypeOptions = INJURY_TYPE_OPTIONS.map((opt) => ({
    value: String(opt.value),
    label: t(opt.labelKey, { defaultValue: opt.defaultLabel }),
  }));

  const injuryBodyPartOptions = INJURY_BODY_PART_OPTIONS.map((opt) => ({
    value: String(opt.value),
    label: t(opt.labelKey, { defaultValue: opt.defaultLabel }),
  }));

  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 space-y-3.5 transition-all animate-in fade-in-50 duration-200",
        className,
      )}
    >
      <div className="flex items-center gap-2 pb-1 border-b border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs">
        <MdHealing className="size-4 shrink-0" />
        <span>{t("injury.title", { defaultValue: "Injury Information" })}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Injury Type */}
        <SelectField
          name={getFieldName("injuryType")}
          label={t("injury.typeLabel", { defaultValue: "Injury Type" })}
          options={injuryTypeOptions}
          placeholder={t("injury.typePlaceholder", {
            defaultValue: "Select injury type...",
          })}
          searchPlaceholder={t("injury.typePlaceholder", {
            defaultValue: "Search injury type...",
          })}
          valueType="number"
          required
        />

        {/* Injury Body Part */}
        <SelectField
          name={getFieldName("injuryBodyPart")}
          label={t("injury.bodyPartLabel", {
            defaultValue: "Affected Body Part",
          })}
          options={injuryBodyPartOptions}
          placeholder={t("injury.bodyPartPlaceholder", {
            defaultValue: "Select body part...",
          })}
          searchPlaceholder={t("injury.bodyPartPlaceholder", {
            defaultValue: "Search body part...",
          })}
          valueType="number"
          required
        />
      </div>

      {/* Injury Comment */}
      <TextareaField
        name={getFieldName("injuryComment")}
        label={t("injury.commentLabel", {
          defaultValue: "Injury Details / Description",
        })}
        placeholder={t("injury.commentPlaceholder", {
          defaultValue: "Describe the injury, cause, or symptoms (optional)...",
        })}
        rows={2}
        textareaClassName="text-xs resize-none bg-background"
      />
    </div>
  );
}
