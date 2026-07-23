import aquaHero from "@/assets/aqua_hero.jpg";

export function HeroPanel() {
  return (
    <div className="relative hidden w-1/2 overflow-hidden lg:block">
      <img
        src={aquaHero}
        alt="Elite swimming"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#080e1a]/80 via-transparent to-[#080e1a]/90" />
      <div className="absolute inset-0 bg-linear-to-t from-[#080e1a] via-transparent to-[#080e1a]/70" />

      <div className="absolute left-8 top-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-400/20 backdrop-blur-sm ring-1 ring-primary-400/30">
          <svg
            className="h-5 w-5 text-primary-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v-4c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2zm0-8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2v-4c-2.5 0-2.5-2-5-2s-2.5 2-5 2-2.5-2-5-2-2.5 2-5 2z" />
          </svg>
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">
          Aqua<span className="text-primary-400">Metrics</span>
        </span>
      </div>

      <div className="absolute bottom-10 left-8 right-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-400/10 px-3 py-1 ring-1 ring-primary-400/20 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
          <span className="text-xs font-medium uppercase tracking-widest text-primary-400">
            Elite Coaching OS
          </span>
        </div>
        <h2 className="mb-2 text-3xl font-bold leading-tight text-white">
          Precision data for
          <br />
          <span className="text-primary-400">peak performance.</span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-300/80">
          High-performance monitoring tools for elite swimming academies.
        </p>

        <div className="mt-6 flex gap-6">
          {[
            { value: "500+", label: "Athletes" },
            { value: "98%", label: "Accuracy" },
            { value: "24/7", label: "Monitoring" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-bold text-primary-400">
                {s.value}
              </div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
