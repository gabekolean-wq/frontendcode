const features = [
  {
    title: "Launch faster",
    description:
      "Turn ideas into polished experiences with a workflow designed for momentum.",
  },
  {
    title: "Stay in sync",
    description:
      "Keep your team aligned with clear updates, shared goals, and instant visibility.",
  },
  {
    title: "Grow with confidence",
    description:
      "Scale your product with thoughtful automation and performance-minded design.",
  },
];

const stats = [
  { label: "Projects launched", value: "120+" },
  { label: "Happy teams", value: "45" },
  { label: "Avg. launch time", value: "2.4x faster" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.25),_transparent_35%),linear-gradient(135deg,_#0f172a_0%,_#111827_45%,_#020617_100%)] px-6 py-8 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex flex-wrap items-center justify-between rounded-full border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-lg">
          <div className="text-lg font-semibold tracking-[0.2em] text-white/90 uppercase">
            Northstar
          </div>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a
              href="#launch"
              className="rounded-full bg-white px-4 py-2 font-medium text-slate-900 transition hover:bg-slate-200"
            >
              Get started
            </a>
          </nav>
        </header>

        <section className="grid items-center gap-10 rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-200">
              New • AI-assisted product launches
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build your next big idea with clarity and momentum.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Northstar helps teams shape compelling digital experiences, ship faster,
              and present their vision with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#launch"
                className="rounded-full bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400"
              >
                Start your project
              </a>
              <a
                href="#features"
                className="rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Explore features
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-400">
              {stats.map((item) => (
                <div key={item.label}>
                  <div className="text-xl font-semibold text-white">{item.value}</div>
                  <div>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-indigo-950/30">
            <div className="rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Launch dashboard</p>
                  <p className="mt-1 text-xl font-semibold text-white">Q3 growth sprint</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
                  On track
                </span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  ["Design system", "92% complete"],
                  ["Product rollout", "4 milestones"],
                  ["Customer feedback", "+18% this week"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{label}</span>
                      <span className="font-medium text-white">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-4 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur"
            >
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>

        <section
          id="launch"
          className="rounded-[2rem] border border-indigo-400/20 bg-indigo-500/10 p-8 text-center backdrop-blur"
        >
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Ready to turn your idea into something remarkable?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-300">
            Bring your vision to life with a launch-ready experience that looks sharp from day one.
          </p>
          <a
            href="#"
            className="mt-7 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Book a demo
          </a>
        </section>
      </div>
    </main>
  );
}
