import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function initialsAvatar(name, tone) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tone}`}
    >
      {initials}
    </div>
  );
}

function Dropdown({ label }) {
  return (
    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
      {label}
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}

function PageShell({ title, subtitle, cta, children }) {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          {cta}
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const CATEGORY_STYLES = {
  Design: "bg-purple-50 text-purple-600",
  Engineering: "bg-sky-50 text-sky-600",
  Product: "bg-indigo-50 text-indigo-600",
  Marketing: "bg-rose-50 text-rose-600",
};

const POST_STATUS_STYLES = {
  Published: "bg-indigo-600 text-white",
  Draft: "bg-slate-100 text-slate-500",
  Scheduled: "bg-amber-50 text-amber-600",
};

const AVATAR_TONES = [
  "bg-rose-100 text-rose-600",
  "bg-indigo-100 text-indigo-600",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-purple-100 text-purple-600",
];

const COVER_TONES = [
  "from-purple-200 to-indigo-100",
  "from-sky-200 to-cyan-100",
  "from-amber-200 to-orange-100",
  "from-emerald-200 to-teal-100",
  "from-rose-200 to-pink-100",
];

const POSTS = [
  { title: "The Future of Remote Design Teams", author: "Elena Rostova", category: "Design", status: "Published", date: "Oct 24, 2024" },
  { title: "Optimizing React Render Performance", author: "David Chen", category: "Engineering", status: "Draft", date: "—" },
  { title: "Q4 Product Roadmap Highlights", author: "Sarah Jenkins", category: "Product", status: "Scheduled", date: "Nov 01, 2024" },
  { title: "Building a Design System from Scratch", author: "Elena Rostova", category: "Design", status: "Published", date: "Sep 30, 2024" },
  { title: "A Guide to Edge Caching Strategies", author: "David Chen", category: "Engineering", status: "Published", date: "Sep 22, 2024" },
  { title: "How We Prioritize Our Backlog", author: "Sarah Jenkins", category: "Product", status: "Draft", date: "—" },
  { title: "Growth Loops That Actually Work", author: "Maya Torres", category: "Marketing", status: "Published", date: "Sep 12, 2024" },
  { title: "Typography Choices for Dashboards", author: "Elena Rostova", category: "Design", status: "Scheduled", date: "Nov 05, 2024" },
  { title: "Migrating Our API to GraphQL", author: "David Chen", category: "Engineering", status: "Published", date: "Aug 29, 2024" },
  { title: "Lessons from Our Last Launch", author: "Maya Torres", category: "Marketing", status: "Draft", date: "—" },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function BlogsPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const totalCount = 24;

  const filtered = useMemo(
    () => POSTS.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  function toggle(i) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <PageShell
      title="Blogs"
      subtitle="Manage, publish, and track your content."
      cta={
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">
          <Plus className="h-4 w-4" />
          Create new post
        </button>
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex gap-2">
          <Dropdown label="All categories" />
          <Dropdown label="Status" />
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            More filters
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-sm">
          <span className="font-medium text-slate-600">{totalCount} posts total</span>
          <div className="flex items-center gap-4 text-slate-400">
            <button className="flex items-center gap-1.5 hover:text-slate-600">
              <Pencil className="h-3.5 w-3.5" />
              Bulk edit
            </button>
            <button className="flex items-center gap-1.5 hover:text-rose-500">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium text-slate-400">
              <th className="w-10 px-5 py-3">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="px-2 py-3 font-medium">Post title</th>
              <th className="px-5 py-3 font-medium">Author</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.title} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={selected.has(i)}
                    onChange={() => toggle(i)}
                    className="rounded border-slate-300"
                  />
                </td>
                <td className="px-2 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-14 shrink-0 rounded-md bg-gradient-to-br ${COVER_TONES[i % COVER_TONES.length]}`}
                    />
                    <span className="font-medium text-slate-800 line-clamp-1">{p.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {initialsAvatar(p.author, AVATAR_TONES[i % AVATAR_TONES.length])}
                    <span className="text-slate-600">{p.author}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_STYLES[p.category]}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${POST_STATUS_STYLES[p.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{p.date}</td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end text-slate-400">
                    <button className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-4 text-sm">
          <span className="text-slate-500">
            Showing 1 to {filtered.length} of {totalCount} entries
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded-md border border-slate-200 p-1.5 text-slate-300" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-md text-sm font-medium ${
                  n === page ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}