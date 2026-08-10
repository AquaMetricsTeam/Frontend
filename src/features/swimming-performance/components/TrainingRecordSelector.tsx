import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTrainingRecordLookup } from "@/features/training-record/hooks/useTrainingRecordLookup";
import { MdAssignment, MdPending } from "react-icons/md";

interface TrainingRecordSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

/**
 * Dropdown to pick an existing training record (from the Lookup endpoint).
 * Shows: athlete name + session title + date.
 */
export function TrainingRecordSelector({
  value,
  onChange,
}: TrainingRecordSelectorProps) {
  const { t } = useTranslation("swimming");
  const { data, isLoading } = useTrainingRecordLookup();
  const records = data?.data ?? [];

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
        <MdAssignment className="size-3.5 text-primary" />
        {t("builder.selectTrainingRecord")}
        <span className="text-destructive">*</span>
      </Label>

      <Select value={value} onValueChange={(val) => onChange(val ?? "")} disabled={isLoading}>
        <SelectTrigger className="h-9 text-xs rounded-lg font-medium">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MdPending className="size-3.5 animate-spin" />
              {t("common.loading")}
            </span>
          ) : (
            <SelectValue placeholder={t("builder.selectTrainingRecord")} />
          )}
        </SelectTrigger>
        <SelectContent>
          {records.map((r) => (
            <SelectItem key={r.id} value={String(r.id)} className="text-xs">
              <span className="font-semibold">{r.athleteName}</span>
              <span className="text-muted-foreground mx-1.5">·</span>
              <span>{r.sessionTitle}</span>
              <span className="text-muted-foreground mx-1.5">·</span>
              <span className="font-mono">{r.sessionDate}</span>
            </SelectItem>
          ))}
          {!isLoading && records.length === 0 && (
            <div className="py-4 text-center text-xs text-muted-foreground">
              {t("builder.noTrainingRecords")}
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
