

const HeroSection = () => {
     return (
    <section className="bg-gradient-to-b from-indigo-50/60 to-white">
      <div className="max-w-3xl mx-auto text-center px-6 pt-20 pb-16">
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
          Where Ideas Shine.
        </h1>
        <p className="mt-4 text-slate-500 text-lg">
          Empower your voice with the world&apos;s most elegant storytelling
          platform.
        </p>

        <div className="mt-8 max-w-xl mx-auto flex items-center gap-2 bg-slate-100 rounded-full px-5 py-3.5 text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span className="text-sm">Discover topics, writers, and stories...</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium px-6 py-2.5 rounded-full">
            Start Writing
          </button>
          <button className="bg-white border border-slate-200 hover:border-slate-300 transition-colors text-slate-700 text-sm font-medium px-6 py-2.5 rounded-full">
            Explore Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;