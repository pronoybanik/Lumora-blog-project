export default function TrustedBy() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 md:px-16 py-8 md:py-12 text-center">
      <p className="text-xs sm:text-sm text-[#464555] uppercase tracking-widest mb-6 md:mb-8">
        Trusted by 50,000+ creators
      </p>
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-12 opacity-50">
        <div className="text-lg sm:text-xl font-bold flex items-center gap-2 text-[#141b2b]">
          <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#141b2b] rounded-full block"></span>
          Nexus
        </div>
        <div className="text-lg sm:text-xl font-bold flex items-center gap-2 italic text-[#141b2b]">
          Aura
          <span className="w-2 h-2 bg-[#141b2b] block rotate-45"></span>
        </div>
        <div className="text-lg sm:text-xl font-bold tracking-tighter text-[#141b2b]">Vanguard</div>
        <div className="text-lg sm:text-xl font-bold text-[#141b2b]">Prismatic</div>
      </div>
    </section>
  )
}
