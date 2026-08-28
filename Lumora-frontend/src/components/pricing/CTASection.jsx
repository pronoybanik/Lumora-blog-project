export default function CTASection() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 md:px-16 py-8 md:py-16">
      <div className="bg-[#3525cd] rounded-3xl md:rounded-[32px] px-6 py-10 sm:px-10 sm:py-14 md:p-16 text-center relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
            Ready to start your journey?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mb-6 md:mb-8">
            Join thousands of creators who have found their voice on Lumora. Setup takes less than 2 minutes.
          </p>
          <button className="bg-white text-[#3525cd] px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-medium active:scale-95 transition-transform shadow-lg">
            Start Writing for Free
          </button>
        </div>
      </div>
    </section>
  )
}
