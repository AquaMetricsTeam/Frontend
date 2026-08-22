import { useTranslation } from "react-i18next";
import aquaHero from "@/assets/aqua_hero3.png";
import logoVertical from "@/assets/logo-horizontal.png";
import { Users, Target, Activity } from "lucide-react";

export function HeroPanel() {
  const { t } = useTranslation("auth");

  return (
    <div className="relative hidden w-1/2 overflow-hidden bg-[#050b18] select-none lg:block">
      {/* Background Swimmer Image */}
      <img
        src={aquaHero}
        alt="Elite Swimming Performance"
        className="absolute inset-0 h-full w-full object-cover object-[30%_50%]"
      />

      {/* Deep Tech Blue Radial & Linear Gradients for Text Readability */}
      <div className="absolute inset-0 bg-linear-to-r from-[#081227] via-[#050b18]/80 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-[#070f20] via-transparent to-[#050b18]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(6,182,212,0.1),transparent_70%)]" />

      {/* Top Header Logo */}
      <div className="absolute top-12 start-12 z-10 flex items-center justify-between">
        <img
          src={logoVertical}
          alt="AquaMetrics"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Main Content & Modern Stat Cards */}
      <div className="relative z-10 flex h-full flex-col justify-end px-10 pb-12">
        <div className="max-w-xl">
          {/* Main Title */}
          <h2 className="mb-3 text-4xl font-extrabold leading-[1.25] tracking-tight text-white xl:text-5xl">
            {t("hero.title")}
          </h2>

          {/* Subtitle */}
          <p className="mb-8 max-w-md text-base leading-relaxed text-slate-300/90 font-light">
            {t("hero.subtitle")}
          </p>

          {/* Performance Telemetry Cards */}
          <div className="grid grid-cols-3 gap-3.5 pt-2">
            {[
              {
                icon: Users,
                value: t("hero.cards.card1.value"),
                title: t("hero.cards.card1.title"),
                subtitle: t("hero.cards.card1.subtitle"),
                badge: t("hero.cards.card1.badge"),
                badgeStyle: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
              },
              {
                icon: Target,
                value: t("hero.cards.card2.value"),
                title: t("hero.cards.card2.title"),
                subtitle: t("hero.cards.card2.subtitle"),
                badge: t("hero.cards.card2.badge"),
                badgeStyle: "bg-sky-500/10 text-sky-300 border-sky-500/20",
              },
              {
                icon: Activity,
                value: t("hero.cards.card3.value"),
                title: t("hero.cards.card3.title"),
                subtitle: t("hero.cards.card3.subtitle"),
                badge: t("hero.cards.card3.badge"),
                badgeStyle:
                  "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
                isLive: true,
              },
            ].map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/60 p-3.5 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-cyan-950/30"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-cyan-400 ring-1 ring-white/10 transition-colors group-hover:bg-cyan-500/15 group-hover:ring-cyan-400/30">
                      <IconComp className="h-3.5 w-3.5" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${stat.badgeStyle}`}
                    >
                      {stat.isLive && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                      )}
                      {stat.badge}
                    </span>
                  </div>

                  <div className="text-xl font-bold tracking-tight text-white font-sans">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-1">
                    {stat.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {stat.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
