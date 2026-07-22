import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack } from "react-icons/md";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center">
      {/* Water ripple SVG */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer rings */}
        <span className="absolute inline-flex size-64 animate-ping rounded-full bg-primary/5 duration-[2000ms]" />
        <span className="absolute inline-flex size-48 animate-ping rounded-full bg-primary/8 duration-[2500ms] delay-300" />
        <span className="absolute inline-flex size-32 animate-ping rounded-full bg-primary/12 duration-[3000ms] delay-600" />

        {/* 404 number */}
        <div className="relative z-10 flex items-center justify-center size-64">
          <span
            className="text-[96px] font-extrabold leading-none tracking-tighter text-primary/20 select-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </span>
        </div>
      </div>

      {/* Pool / water drop icon */}
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
        <svg
          className="size-8 text-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
        </svg>
      </div>

      <h1
        className="mb-3 text-3xl font-bold tracking-tight text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {t("common:notFound.title")}
      </h1>

      <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {t("common:notFound.description")}
      </p>

      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary-600"
      >
        <MdArrowBack className="size-4" />
        {t("common:notFound.backHome")}
      </button>
    </div>
  );
};

export default NotFound;
