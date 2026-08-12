import aquaHero from "@/assets/aqua_hero3.png";
import logoVertical from "@/assets/logo-horizontal.png";
import { Users, Target, Activity } from "lucide-react";

export function HeroPanel() {
  return (
    <div className="relative hidden w-1/2 overflow-hidden bg-[#050b18] select-none lg:block">
      {/* Background Swimmer Image */}
      <img
        src={aquaHero}
        alt="Elite Swimming Performance"
        className="absolute inset-0 h-full w-full object-cover object-[30%_50%]  "
      />

      {/* Deep Tech Blue Radial & Linear Gradients for Text Readability */}
      <div className="absolute inset-0 bg-linear-to-r from-[#081227] via-[#050b18]/80 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-[#070f20] via-transparent to-[#050b18]/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(6,182,212,0.1),transparent_70%)]" />

      {/* Geometric Graphic Overlay 1: Top-Right Overlapping Glowing Circles */}
      <svg
        className="pointer-events-none absolute -top-16 -right-16 h-[480px] w-[480px] opacity-70"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="320"
          cy="180"
          r="220"
          fill="url(#circleGrad1)"
          fillOpacity="0.25"
        />

        <circle
          cx="300"
          cy="200"
          r="150"
          stroke="url(#strokeGrad2)"
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
        <defs>
          <radialGradient
            id="circleGrad1"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(320 180) rotate(90) scale(220)"
          >
            <stop stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="0.7" stopColor="#0ea5e9" stopOpacity="0.1" />
            <stop offset="1" stopColor="#050b18" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="strokeGrad1" x1="140" y1="140" x2="520" y2="330">
            <stop stopColor="#38bdf8" />
            <stop offset="0.5" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="strokeGrad2" x1="150" y1="200" x2="450" y2="200">
            <stop stopColor="#06b6d4" />
            <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Geometric Graphic Overlay 2: Top-Right Dot Matrix */}
      <svg
        className="pointer-events-none absolute top-12 right-12 h-28 w-28 opacity-40"
        viewBox="0 0 100 100"
        fill="none"
      >
        <pattern
          id="dotMatrix"
          x="0"
          y="0"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="3" cy="3" r="1.5" fill="#38bdf8" />
        </pattern>
        <rect width="100" height="100" fill="url(#dotMatrix)" />
      </svg>

      {/* Geometric Graphic Overlay 3: Bottom Left & Right Laser Curved Arcs */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 opacity-50"
        viewBox="0 0 300 300"
        fill="none"
      >
        <path
          d="M -50 300 C 50 250, 180 220, 300 320"
          stroke="url(#bottomArc1)"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id="bottomArc1" x1="0" y1="280" x2="250" y2="250">
            <stop stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="1" stopColor="#080e1a" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        className="pointer-events-none absolute -bottom-10 -right-10 h-80 w-80 opacity-40"
        viewBox="0 0 300 300"
        fill="none"
      >
        <circle
          cx="250"
          cy="250"
          r="200"
          stroke="url(#bottomArc2)"
          strokeWidth="1"
        />
        <defs>
          <linearGradient id="bottomArc2" x1="100" y1="50" x2="300" y2="250">
            <stop stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="1" stopColor="#050b18" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Header Logo */}
      <div className="absolute top-12 left-12 z-10 flex items-center justify-between ">
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
          <h2 className="mb-3 text-4xl font-extrabold leading-[1.15] tracking-tight text-white xl:text-5xl">
            Precision data
            <br />
            for{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]">
              peak performance.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mb-8 max-w-md text-base leading-relaxed text-slate-300/90 font-light">
            High-performance monitoring tools for elite swimming academies.
          </p>

          {/* Performance Telemetry Cards */}
          <div className="grid grid-cols-3 gap-3.5 pt-2">
            {[
              {
                icon: Users,
                value: "500+",
                title: "Athletes Tracked",
                subtitle: "Active roster",
                badge: "Roster",
                badgeStyle: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
              },
              {
                icon: Target,
                value: "0.01s",
                title: "Lap & Split Precision",
                subtitle: "Turn & stroke timing",
                badge: "Telemetry",
                badgeStyle: "bg-sky-500/10 text-sky-300 border-sky-500/20",
              },
              {
                icon: Activity,
                value: "Live",
                title: "Performance Stream",
                subtitle: "Real-time analytics",
                badge: "Active",
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
