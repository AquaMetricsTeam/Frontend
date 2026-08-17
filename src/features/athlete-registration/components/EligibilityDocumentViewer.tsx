import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdDescription,
  MdOpenInNew,
  MdDownload,
  MdZoomIn,
  MdErrorOutline,
  MdClose,
} from "react-icons/md";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EligibilityDocumentViewerProps {
  documentUrl?: string | null;
  athleteName?: string;
}

function isImageUrl(url: string): boolean {
  const cleanUrl = url.split("?")[0].toLowerCase();
  return (
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.endsWith(".gif") ||
    cleanUrl.endsWith(".svg")
  );
}

function isPdfUrl(url: string): boolean {
  const cleanUrl = url.split("?")[0].toLowerCase();
  return cleanUrl.endsWith(".pdf");
}

export function EligibilityDocumentViewer({
  documentUrl,
  athleteName,
}: EligibilityDocumentViewerProps) {
  const { t } = useTranslation("athletes");
  const [isZoomed, setIsZoomed] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!documentUrl) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
          <MdDescription className="size-6" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">
          {t("registration.documentViewer.noDocumentTitle")}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          {t("registration.documentViewer.noDocumentDesc")}
        </p>
      </div>
    );
  }

  const isImage = isImageUrl(documentUrl);
  const isPdf = isPdfUrl(documentUrl);

  return (
    <div className="flex flex-col gap-3">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 p-2.5 border border-border/60">
        <div className="flex items-center gap-2 min-w-0">
          <MdDescription className="size-4 text-primary shrink-0" />
          <span className="truncate text-xs font-medium text-foreground">
            {isPdf
              ? t("registration.documentViewer.pdfDocument")
              : isImage
              ? t("registration.documentViewer.imageDocument")
              : t("registration.documentViewer.eligibilityProof")}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isImage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 px-2 cursor-pointer"
              onClick={() => setIsZoomed(true)}
            >
              <MdZoomIn className="size-3.5" />
              <span>{t("registration.documentViewer.preview")}</span>
            </Button>
          )}

          <a
            href={documentUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-7 text-xs gap-1 px-2 cursor-pointer",
            )}
          >
            <MdOpenInNew className="size-3.5" />
            <span>{t("registration.documentViewer.open")}</span>
          </a>

          <a
            href={documentUrl}
            download
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "h-7 text-xs gap-1 px-2 cursor-pointer",
            )}
          >
            <MdDownload className="size-3.5" />
            <span>{t("registration.documentViewer.download")}</span>
          </a>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-xs">
        {hasError ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MdErrorOutline className="size-8 text-destructive mb-2" />
            <p className="text-xs text-muted-foreground">
              {t("registration.documentViewer.failedToLoad")}
            </p>
            <a
              href={documentUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "mt-2 text-xs",
              )}
            >
              {t("registration.documentViewer.openDirectly")}
            </a>
          </div>
        ) : isImage ? (
          <div
            className="group relative flex items-center justify-center bg-muted/20 p-2 cursor-pointer max-h-96 overflow-hidden"
            onClick={() => setIsZoomed(true)}
          >
            <img
              src={documentUrl}
              alt={athleteName ? `${athleteName} Document` : "Eligibility Document"}
              className="max-h-80 w-auto rounded-lg object-contain transition-transform duration-200 group-hover:scale-[1.01]"
              onError={() => setHasError(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-md">
                <MdZoomIn className="size-4 text-primary" />
                {t("registration.documentViewer.clickToZoom")}
              </span>
            </div>
          </div>
        ) : isPdf ? (
          <div className="h-96 w-full bg-muted/30">
            <iframe
              src={`${documentUrl}#toolbar=0`}
              title="Eligibility Document PDF"
              className="h-full w-full border-none rounded-xl"
              onError={() => setHasError(true)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/10">
            <MdDescription className="size-10 text-primary mb-3" />
            <p className="text-xs font-medium text-foreground">
              {t("registration.documentViewer.externalDocument")}
            </p>
            <a
              href={documentUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-3 text-xs gap-1.5",
              )}
            >
              <MdOpenInNew className="size-3.5" />
              {t("registration.documentViewer.viewExternal")}
            </a>
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomed && isImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in-0 duration-150"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-card p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-xs font-semibold text-foreground">
                {athleteName ? `${athleteName} - ` : ""}
                {t("registration.documentViewer.documentPreview")}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7 rounded-full cursor-pointer"
                onClick={() => setIsZoomed(false)}
              >
                <MdClose className="size-4" />
              </Button>
            </div>
            <div className="overflow-auto max-h-[calc(90vh-4rem)] p-2">
              <img
                src={documentUrl}
                alt="Zoomed Document"
                className="max-h-[80vh] w-auto mx-auto rounded object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
