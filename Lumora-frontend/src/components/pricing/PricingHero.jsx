export default function PricingHero({ yearly, setYearly }) {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 md:px-16 pt-10 sm:pt-14 md:pt-16 pb-8 md:pb-12 flex flex-col items-center text-center">
      <h1 className="text-[32px] sm:text-[44px] md:text-[64px] font-bold leading-[1.15] tracking-tight text-[#141b2b] mb-3 md:mb-4">
        Simple, transparent pricing.
      </h1>
      <p className="text-base sm:text-lg text-[#464555] max-w-2xl mb-6 md:mb-10 px-2">
        Empower your voice with the tools you need to shine. Choose the plan that fits your ambition.
      </p>

      <div className="flex items-center gap-2 bg-[#f1f3ff] p-1.5 rounded-full shadow-sm relative">
        <button
          onClick={() => setYearly(false)}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all ${
            !yearly ? 'bg-white shadow-sm text-[#141b2b]' : 'text-[#464555]'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setYearly(true)}
          className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            yearly ? 'bg-white shadow-sm text-[#141b2b]' : 'text-[#464555]'
          }`}
        >
          Yearly
          <span className="bg-[#3525cd]/10 text-[#3525cd] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
            2 mos free
          </span>
        </button>
      </div>
    </section>
  )
}
