import { Navigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdOutlineBlock } from "react-icons/md";
import { useAuth } from "@/components/Providers/AuthProvider";

export default function UnauthorizedPage() {
  const { t } = useTranslation("common");
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#080e1a] text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
        <MdOutlineBlock className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold">{t("unauthorized.title")}</h1>
      <p className="max-w-sm text-center text-sm text-slate-400">
        {t("unauthorized.description")}
      </p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 ring-1 ring-cyan-500/30 transition hover:bg-cyan-500/20"
      >
        {t("unauthorized.backHome")}
      </Link>
    </div>
  );
}
