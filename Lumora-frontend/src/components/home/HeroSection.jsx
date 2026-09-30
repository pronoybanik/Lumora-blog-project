import { useState } from "react";

const topics = ["Technology", "Design", "Health", "Money", "Culture"];

const HeroSection = () => {
  const [query, setQuery] = useState("");

  return (
    <section className="bg-indigo-50/60 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-14 items-center">
        {/* Copy */}
        <div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.05]">
            Where good ideas find their readers.
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-md leading-relaxed">
            Write a story in minutes, publish it in one click, and reach people
            who care about what you have to say.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors text-white font-medium px-7 py-3.5 rounded-full shadow-lg shadow-indigo-600/25">
              Start writing
            </button>
            <button className="bg-white border border-slate-300 hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors text-slate-800 font-medium px-7 py-3.5 rounded-full">
              Read stories
            </button>
          </div>

          <div className="mt-10 max-w-md">
            <label htmlFor="hero-search" className="sr-only">
              Search topics, writers, and stories
            </label>
            <div className="flex items-center gap-2 bg-white rounded-full pl-5 pr-2 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, writers, stories"
                className="flex-1 min-w-0 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              <button className="bg-slate-900 hover:bg-slate-700 transition-colors text-white text-sm font-medium px-5 py-2 rounded-full">
                Search
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="text-sm text-slate-600 bg-white/70 hover:bg-white border border-slate-200 rounded-full px-3.5 py-1 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual: stack of story cards, the top one being written */}
        <div className="relative h-[380px] sm:h-[420px]" aria-hidden="true">
          <div className="absolute top-2 left-4 right-10 h-64 bg-amber-200 rounded-3xl -rotate-6" />
          <div className="absolute top-6 left-10 right-4 h-64 bg-indigo-200 rounded-3xl rotate-3" />
          <div className="absolute top-12 left-2 right-8 bg-white rounded-3xl shadow-2xl shadow-indigo-900/15 p-7 -rotate-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                M
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Maya Rahman</p>
                <p className="text-xs text-slate-500">Draft · 4 min read</p>
              </div>
            </div>
            <h2 className="mt-5 font-serif text-2xl font-bold text-slate-900 leading-snug">
              What a year of writing every morning taught me
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              The first month I wrote nothing worth keeping. By month three, I
              stopped waiting for inspiration and started
              <span className="inline-block w-0.5 h-5 bg-indigo-600 ml-1 align-middle motion-safe:animate-pulse" />
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <span className="bg-indigo-50 text-indigo-700 rounded-full px-3 py-1">Writing</span>
              <span className="bg-amber-50 text-amber-700 rounded-full px-3 py-1">Habits</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;