import React from "react";
import {
  ArrowLeft,
  Eye,
  Settings,
  ChevronDown,
  ImagePlus,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";

export default function CreateBlogs() {
  const [categories, setCategories] = React.useState(["Design"]);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [slug, setSlug] = React.useState("the-architecture-of-silence");
  const [excerpt, setExcerpt] = React.useState("");

  const removeCategory = (cat) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <div className="min-h-screen bg-[#f4f4fb] text-slate-900 font-sans">
      {/* Top toolbar */}
      <header className="border-b border-slate-200 bg-[#f7f7fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <button className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 shrink-0">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to posts</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <span className="truncate">Draft saved 2 mins ago</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
              <Eye size={16} />
              Preview
            </button>
            <button className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
              <Settings size={16} />
              Settings
            </button>
            <button className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium pl-4 pr-3 py-2 rounded-full">
              Publish
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Editor */}
        <section className="lg:col-span-3">
          <textarea
            rows={2}
            placeholder="The architecture of silence."
            defaultValue="The architecture of silence."
            className="w-full resize-none bg-transparent text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-300 placeholder:text-slate-300 focus:outline-none leading-tight mb-4"
          />
          <input
            type="text"
            placeholder="Add a subtitle (optional)..."
            className="w-full bg-transparent text-lg sm:text-xl text-slate-300 placeholder:text-slate-300 focus:outline-none mb-8"
          />

          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Every great design begins with an even better story.{" "}
              <span className="text-indigo-600">Begin</span> yours here...
            </p>

            <div>
              <h3 className="font-bold text-slate-900 mb-1">The Foundation</h3>
              <p>
                <span className="text-indigo-600">Minimalism</span> isn't
                about removing things until there is nothing left.{" "}
                <span className="text-indigo-600">It's</span> about removing
                the unnecessary so that the necessary may speak.
              </p>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-4">
            Post settings
          </p>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-6">
            {/* Featured image */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Featured image
              </p>
              <button className="w-full aspect-[4/3] rounded-xl bg-indigo-50 border border-dashed border-indigo-200 flex flex-col items-center justify-center gap-2 text-indigo-400 hover:bg-indigo-100/60 transition-colors">
                <ImagePlus size={22} />
                <span className="text-xs font-medium">
                  Upload or drag image
                </span>
              </button>
            </div>

            {/* URL slug */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                URL slug
              </p>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-sm">
                <span className="bg-slate-50 text-slate-400 px-3 py-2 whitespace-nowrap">
                  lumora.co/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 min-w-0 px-2 py-2 focus:outline-none text-slate-700"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Categories
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-medium pl-3 pr-2 py-1.5 rounded-full"
                  >
                    {cat}
                    <button
                      onClick={() => removeCategory(cat)}
                      aria-label={`Remove ${cat}`}
                      className="hover:bg-indigo-700 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button className="flex items-center gap-1 text-xs font-medium text-slate-500 border border-slate-200 pl-2.5 pr-3 py-1.5 rounded-full hover:bg-slate-50">
                  <Plus size={12} />
                  Add
                </button>
              </div>
            </div>

            {/* SEO excerpt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-500">
                  SEO excerpt
                </p>
                <span className="text-xs text-slate-400">
                  {excerpt.length}/160
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={160}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a brief summary for search engines..."
                className="w-full resize-none border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Advanced settings */}
            <button
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex items-center justify-between text-xs font-semibold text-indigo-700"
            >
              Advanced settings
              <ChevronRight
                size={14}
                className={`transition-transform ${
                  advancedOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {advancedOpen && (
              <div className="text-sm text-slate-500 -mt-3">
                No advanced settings yet.
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}