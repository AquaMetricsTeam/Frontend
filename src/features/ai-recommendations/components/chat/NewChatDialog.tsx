import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";
import { createChatSessionSchema } from "../../constants/validations";
import { useCreateChatSession } from "../../hooks/useCreateChatSession";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (sessionId: number) => void;
}

export default function NewChatDialog({
  open,
  onOpenChange,
  onCreated,
}: NewChatDialogProps) {
  const { t } = useTranslation("aiChat");
  const [athleteId, setAthleteId] = useState("");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState<string | undefined>();

  const athletesQuery = useAthletesLookup(open);
  const athleteOptions = (athletesQuery.data?.data ?? []).map((a) => ({
    value: a.athleteId,
    label: a.fullName,
  }));

  const createSession = useCreateChatSession((sessionId) => {
    onOpenChange(false);
    setAthleteId("");
    setTitle("");
    onCreated(sessionId);
  });

  const handleCreate = () => {
    const result = createChatSessionSchema.safeParse({
      athleteId: athleteId || undefined,
      title: title.trim() || undefined,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const titleKey = fieldErrors.title?.[0];
      setTitleError(titleKey ? t(titleKey) : undefined);
      return;
    }

    setTitleError(undefined);
    createSession.mutate({
      athleteId: result.data.athleteId,
      title: result.data.title,
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setAthleteId("");
      setTitle("");
      setTitleError(undefined);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("newChat.title")}</DialogTitle>
          <DialogDescription>{t("newChat.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <ComboboxSelect
            label={t("newChat.athleteLabel")}
            placeholder={t("newChat.athletePlaceholder")}
            options={athleteOptions}
            value={athleteId}
            onValueChange={setAthleteId}
            disabled={athletesQuery.isLoading}
            emptyMessage={t("newChat.generalChat")}
          />

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
              {t("newChat.titleLabel")}
            </Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(undefined);
              }}
              placeholder={t("newChat.titlePlaceholder")}
              maxLength={200}
              className={titleError ? "border-destructive focus-visible:ring-destructive/50" : ""}
            />
            {titleError && (
              <p className="text-xs text-destructive">{titleError}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={createSession.isPending}
          >
            {t("newChat.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={createSession.isPending}
            className="cursor-pointer"
          >
            {createSession.isPending
              ? t("newChat.creating")
              : t("newChat.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
