import React from "react";
import {
  Search,
  Bell,
  ArrowLeft,
  ArrowRight,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Share2,
  Users,
  Globe,
} from "lucide-react";

const trendingSide = [
  {
    tag: "Technology",
    tagColor: "bg-blue-600",
    title: "Quantum Computing: A Pragmatic Look at the Next Decade",
    author: "Marcus Chen",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
    read: "5m read",
    swatch: "bg-violet-200",
  },
  {
    tag: "Culture",
    tagColor: "bg-orange-700",
    title: "The Resurgence of Print in a Digital-First Era",
    author: "Sarah Jenkins",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces",
    read: "12m read",
    swatch: "bg-rose-100",
  },
];

const authors = [
  {
    name: "Elena Rostova",
    role: "Design Lead @ Meta",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
  },
  {
    name: "Marcus Chen",
    role: "Tech Analyst",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
  },
];

const filters = ["All", "Design", "Tech", "Business"];

export default function BlogList() {
  const [activeFilter, setActiveFilter] = React.useState("All");

  return (
    <div className="min-h-screen bg-[#f4f4fb] text-slate-900 font-sans">
      <main className="max-w-7xl mx-auto px-6">
        {/* Trending Now */}
        <section className="pt-10 pb-14">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-1">
                Top Stories
              </p>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Trending Now
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                <ArrowLeft size={16} />
              </button>
              <button className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Feature card */}
            <a
              href="#"
              className="lg:col-span-2 relative rounded-2xl overflow-hidden h-[480px] group block"
            >
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=900&fit=crop"
                alt="Modern glass skyscrapers"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  Design
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <h2 className="text-white text-3xl font-bold leading-tight mb-4 max-w-xl">
                  The Architecture of Digital Spaces: Building for the Modern
                  User
                </h2>
                <div className="flex items-center gap-2.5 text-sm text-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces"
                    className="w-7 h-7 rounded-full object-cover"
                    alt="Elena Rostova"
                  />
                  <span className="font-medium text-white">Elena Rostova</span>
                  <span className="text-slate-400">•</span>
                  <span>Oct 24, 2024</span>
                  <span className="text-slate-400">•</span>
                  <span>8 min read</span>
                </div>
              </div>
            </a>

            {/* Two side cards */}
            <div className="flex flex-col gap-6">
              {trendingSide.map((item) => (
                <a
                  key={item.title}
                  href="#"
                  className="flex-1 rounded-2xl bg-white border border-slate-100 p-6 flex flex-col justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    <span
                      className={`inline-block text-white text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                    <h3 className="text-lg font-bold leading-snug mb-4">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-slate-700">{item.author}</span>
                    </div>
                    <div
                      className={`w-14 h-14 rounded-xl ${item.swatch} flex items-end justify-end p-2`}
                    >
                      <span className="text-[11px] text-slate-500 bg-white/70 px-1.5 py-0.5 rounded">
                        {item.read}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="pb-20 grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Latest Articles
              </h2>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-full p-1">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                      activeFilter === f
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1 */}
              <a href="#" className="group block">
                <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop"
                    alt="Desk workspace with notebook and coffee"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs font-semibold text-indigo-700 mb-1.5">
                  Productivity · 4m read
                </p>
                <h3 className="text-xl font-bold leading-snug mb-2">
                  Mastering the Art of Deep Work in an Open Office
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Navigating distractions requires more than just
                  noise-canceling headphones. It requires a fundamental shift in
                  how we structure our...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                      className="w-6 h-6 rounded-full object-cover"
                      alt="David Kim"
                    />
                    <span className="text-slate-700">David Kim</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={14} /> 245
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} /> 42
                    </span>
                  </div>
                </div>
              </a>

              {/* Card 2 - essay, no image */}
              <a
                href="#"
                className="group block bg-indigo-50/60 rounded-2xl p-6 h-fit"
              >
                <p className="text-xs font-semibold text-orange-600 mb-1.5">
                  Essay · 15m read
                </p>
                <h3 className="text-xl font-bold leading-snug mb-2">
                  The Illusion of Choice in Modern UI Design
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  When every application follows the same exact design system
                  patterns, are we actually giving users a better experience, or
                  just a more predictable one?
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 rounded-full bg-orange-200 text-orange-800 text-[11px] font-semibold flex items-center justify-center">
                      AL
                    </span>
                    <span className="text-slate-700">Anna Lee</span>
                  </div>
                  <Bookmark size={16} className="text-slate-400" />
                </div>
              </a>

              {/* Card 3 */}
              <a href="#" className="group block">
                <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
                    alt="Network of connected nodes"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs font-semibold text-indigo-700 mb-1.5">
                  Web3 · 7m read
                </p>
                <h3 className="text-xl font-bold leading-snug mb-2">
                  Decentralization: Beyond the Hype
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  A critical analysis of practical applications for
                  decentralized ledger technology in everyday...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=64&h=64&fit=crop&crop=faces"
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Sam Rodriguez"
                    />
                    <span className="text-slate-700">Sam Rodriguez</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-400 text-sm">
                    <ThumbsUp size={14} /> 189
                  </span>
                </div>
              </a>
              <a href="#" className="group block">
                <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
                    alt="Network of connected nodes"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs font-semibold text-indigo-700 mb-1.5">
                  Web3 · 7m read
                </p>
                <h3 className="text-xl font-bold leading-snug mb-2">
                  Decentralization: Beyond the Hype
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  A critical analysis of practical applications for
                  decentralized ledger technology in everyday...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=64&h=64&fit=crop&crop=faces"
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Sam Rodriguez"
                    />
                    <span className="text-slate-700">Sam Rodriguez</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-400 text-sm">
                    <ThumbsUp size={14} /> 189
                  </span>
                </div>
              </a>
              <a href="#" className="group block">
                <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
                    alt="Network of connected nodes"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs font-semibold text-indigo-700 mb-1.5">
                  Web3 · 7m read
                </p>
                <h3 className="text-xl font-bold leading-snug mb-2">
                  Decentralization: Beyond the Hype
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  A critical analysis of practical applications for
                  decentralized ledger technology in everyday...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=64&h=64&fit=crop&crop=faces"
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Sam Rodriguez"
                    />
                    <span className="text-slate-700">Sam Rodriguez</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-400 text-sm">
                    <ThumbsUp size={14} /> 189
                  </span>
                </div>
              </a>
              <a href="#" className="group block">
                <div className="rounded-2xl overflow-hidden mb-4 aspect-[4/3] bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
                    alt="Network of connected nodes"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs font-semibold text-indigo-700 mb-1.5">
                  Web3 · 7m read
                </p>
                <h3 className="text-xl font-bold leading-snug mb-2">
                  Decentralization: Beyond the Hype
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  A critical analysis of practical applications for
                  decentralized ledger technology in everyday...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <img
                      src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=64&h=64&fit=crop&crop=faces"
                      className="w-6 h-6 rounded-full object-cover"
                      alt="Sam Rodriguez"
                    />
                    <span className="text-slate-700">Sam Rodriguez</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-400 text-sm">
                    <ThumbsUp size={14} /> 189
                  </span>
                </div>
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-12 py-4">
              <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
              Loading more stories...
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-lg mb-4">Popular Authors</h3>
              <div className="flex flex-col gap-4">
                {authors.map((a) => (
                  <div key={a.name} className="flex items-center gap-3">
                    <img
                      src={a.avatar}
                      alt={a.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{a.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {a.role}
                      </p>
                    </div>
                    <button className="text-xs font-medium text-indigo-700 hover:text-indigo-900">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
