import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { LANG_DIR } from "@/constants/i18nConfig";

interface PaginationProps {
  pageCount?: number;
  className?: string;
}

const PAGE_PARAM = "page";
const SIBLING_COUNT = 1;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left = Math.max(current - SIBLING_COUNT, 2);
  const right = Math.min(current + SIBLING_COUNT, total - 1);

  const pages: (number | "...")[] = [1];

  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

function Pagination({ pageCount, className }: PaginationProps) {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isRtl = LANG_DIR[i18n.language as Locale] === "rtl";

  if (!pageCount || pageCount <= 1) return null;

  const currentPage = Math.max(
    1,
    Math.min(Number(searchParams.get(PAGE_PARAM) ?? 1), pageCount)
  );

  function goTo(page: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(PAGE_PARAM, String(page));
      return next;
    });
  }

  const pages = getPageNumbers(currentPage, pageCount);

  const PrevIcon = isRtl ? MdChevronRight : MdChevronLeft;
  const NextIcon = isRtl ? MdChevronLeft : MdChevronRight;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* Previous */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label={t("common:pagination.previous")}
        className={cn(
          "flex h-8 min-w-8 items-center justify-center rounded-md px-2",
          "text-sm text-muted-foreground transition-colors duration-150",
          "hover:bg-accent hover:text-foreground",
          "disabled:pointer-events-none disabled:opacity-40"
        )}
      >
        <PrevIcon className="size-4" />
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground select-none"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goTo(page)}
            aria-label={`${t("common:pagination.page")} ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "flex h-8 min-w-8 items-center justify-center rounded-md px-2",
              "text-sm transition-colors duration-150",
              page === currentPage
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= pageCount}
        aria-label={t("common:pagination.next")}
        className={cn(
          "flex h-8 min-w-8 items-center justify-center rounded-md px-2",
          "text-sm text-muted-foreground transition-colors duration-150",
          "hover:bg-accent hover:text-foreground",
          "disabled:pointer-events-none disabled:opacity-40"
        )}
      >
        <NextIcon className="size-4" />
      </button>
    </nav>
  );
}

export default Pagination;
