import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TrainingSession } from "@/features/training-plans/types";
import type { SessionAthlete } from "@/features/training-plans/types";

interface SessionAthleteSelectorProps {
  sessions: TrainingSession[];
  athletes: { id: string; name: string }[];
  selectedSessionId: string;
  selectedAthleteId: string;
  onSessionChange: (id: string) => void;
  onAthleteChange: (id: string) => void;
}

export function SessionAthleteSelector({
  sessions,
  athletes,
  selectedSessionId,
  selectedAthleteId,
  onSessionChange,
  onAthleteChange,
}: SessionAthleteSelectorProps) {
  const { t } = useTranslation("swimming");

  const selectedSession = sessions.find((s) => String(s.id) === selectedSessionId);
  const sessionAthletes: SessionAthlete[] = selectedSession?.athletes ?? [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Session Dropdown */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">
          {t("builder.selectSession")} *
        </Label>
        <Select value={selectedSessionId} onValueChange={onSessionChange}>
          <SelectTrigger className="h-9 text-xs rounded-lg font-medium">
            <SelectValue placeholder={t("builder.selectSession")} />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((sess) => (
              <SelectItem
                key={sess.id}
                value={String(sess.id)}
                className="text-xs"
              >
                {sess.title} ({sess.sessionDate})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Athlete Dropdown */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">
          {t("builder.selectAthlete")}
        </Label>
        <Select value={selectedAthleteId} onValueChange={onAthleteChange}>
          <SelectTrigger className="h-9 text-xs rounded-lg font-medium">
            <SelectValue placeholder={t("builder.selectAthlete")} />
          </SelectTrigger>
          <SelectContent>
            {(sessionAthletes.length > 0 ? sessionAthletes : athletes).map((ath) => (
              <SelectItem
                key={"athleteId" in ath ? ath.athleteId : ath.id}
                value={"athleteId" in ath ? ath.athleteId : ath.id}
                className="text-xs"
              >
                {"fullName" in ath ? ath.fullName : ath.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
