import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAttachFile, MdUpload } from "react-icons/md";
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
import { cn } from "@/lib/utils";
import { KNOWLEDGE_DOMAINS } from "../constants/enums";
import { uploadKnowledgeDocumentSchema } from "../constants/validations";
import { useUploadKnowledgeDocument } from "../hooks/useUploadKnowledgeDocument";

interface UploadKnowledgeDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormErrors {
  title?: string;
  domainId?: string;
  file?: string;
}

export default function UploadKnowledgeDocumentDialog({
  open,
  onOpenChange,
}: UploadKnowledgeDocumentDialogProps) {
  const { t } = useTranslation("aiKnowledge");

  const [title, setTitle] = useState("");
  const [domainId, setDomainId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate: upload, isPending } = useUploadKnowledgeDocument(() => {
    onOpenChange(false);
  });

  function handleSubmit() {
    const result = uploadKnowledgeDocumentSchema.safeParse({
      title,
      domainId: domainId ? Number(domainId) : undefined,
      file: file ?? undefined,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0]
          ? t(fieldErrors.title[0])
          : undefined,
        domainId: fieldErrors.domainId?.[0]
          ? t(fieldErrors.domainId[0])
          : undefined,
        file: fieldErrors.file?.[0] ? t(fieldErrors.file[0]) : undefined,
      });
      return;
    }

    setErrors({});
    upload({
      file: result.data.file,
      title: result.data.title,
      domainId: result.data.domainId,
    });
  }

  const domainOptions = KNOWLEDGE_DOMAINS.map((d) => ({
    value: String(d.id),
    label: t(d.labelKey),
  }));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("upload.title")}</DialogTitle>
          <DialogDescription>{t("upload.description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
              {t("upload.fileLabel")}
            </Label>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-6 transition-colors",
                file
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-muted/30 hover:bg-muted/50",
                isPending && "cursor-not-allowed opacity-60",
                errors.file && "border-destructive/50",
              )}
            >
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                disabled={isPending}
              />
              <MdAttachFile
                className={cn(
                  "size-5 shrink-0",
                  file ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "truncate text-sm",
                  file
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {file ? file.name : t("upload.filePlaceholder")}
              </span>
            </label>
            {errors.file && (
              <p className="px-0.5 text-xs text-destructive">{errors.file}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
              {t("upload.titleLabel")}
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("upload.titlePlaceholder")}
              disabled={isPending}
              className={cn(
                "text-sm",
                errors.title &&
                  "border-destructive focus-visible:ring-destructive/50",
              )}
            />
            {errors.title && (
              <p className="px-0.5 text-xs text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          <ComboboxSelect
            label={t("upload.domainLabel")}
            placeholder={t("upload.domainPlaceholder")}
            options={domainOptions}
            value={domainId}
            onValueChange={setDomainId}
            disabled={isPending}
            error={errors.domainId}
          />
        </div>

        <DialogFooter showCloseButton>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="min-w-24 cursor-pointer gap-2"
          >
            <MdUpload className="size-4" />
            {isPending ? t("upload.uploading") : t("upload.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}