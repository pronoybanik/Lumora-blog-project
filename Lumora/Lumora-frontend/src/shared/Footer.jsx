

const Footer = () => {
  const linkColumns = [
    {
      heading: "PRODUCT",
      links: ["Changelog", "Newsletter", "Premium", "Pricing"],
    },
    {
      heading: "COMPANY",
      links: ["About", "Careers", "Press", "Contact"],
    },
    {
      heading: "RESOURCES",
      links: ["Help Center", "Community", "Guidelines", "Writers"],
    },
  ];

  const socials = [
    {
      label: "Twitter",
      path: "M22 4.01c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 11.1 7.7a12.13 12.13 0 0 1-8.81-4.47 4.29 4.29 0 0 0 1.32 5.72 4.25 4.25 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.93.07 4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 17.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.19-6.53 12.19-12.19l-.01-.55A8.7 8.7 0 0 0 22 4.01z",
    },
    {
      label: "LinkedIn",
      path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
    },
  ];

  return (
    <footer className="border-t border-slate-100 bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        {/* Top row: brand + newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 pb-12 border-b border-slate-200">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                L
              </div>
              <span className="text-lg font-semibold text-indigo-700">
                Lumora
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Where Ideas Shine. Empower your voice with the world&apos;s most
              elegant storytelling platform.
            </p>
            <div className="flex items-center gap-3 text-slate-400 mt-5">
              {socials.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={s.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[320px]">
            <p className="text-xs font-semibold tracking-wide text-slate-800 mb-3">
              STAY IN THE LOOP
            </p>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full p-1.5">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none px-3"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Middle row: link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 py-12">
          {linkColumns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold tracking-wide text-slate-800 mb-4">
                {col.heading}
              </p>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {col.links.map((link) => (
                  <li
                    key={link}
                    className="hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row: copyright + legal */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            &copy; 2024 Lumora Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-600 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
