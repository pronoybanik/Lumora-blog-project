import React from "react";
import {
  Eye,
  Heart,
  Users,
  Plus,
  MoreVertical,
  Award,
  Lightbulb,
} from "lucide-react";
import AdminNavbar from "./AdminNavbar";

const recentBlogs = [
  {
    title: "The Future of Design Systems",
    status: "Published",
    meta: "2 days ago",
    views: "45k",
    visibility: "Public",
    thumbColor: "bg-gradient-to-br from-rose-200 via-amber-100 to-indigo-200",
  },
  {
    title: "Understanding CSS Grid Layouts",
    status: "Draft",
    meta: "Last edited 4 hours ago",
    views: null,
    visibility: "Private",
    thumbColor: "bg-slate-200",
  },
  {
    title: "Mastering Typography in Web",
    status: "Published",
    meta: "1 week ago",
    views: "12k",
    visibility: "Public",
    thumbColor: "bg-slate-300",
  },
];

function StatCard({ label, value, delta, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className="w-5 h-5 text-slate-300" strokeWidth={2} />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {delta && (
          <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
            {delta}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  return (
    
      <div className="px-10 py-10 max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-2">
              Welcome back. Here&apos;s your creative performance at a glance.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium shrink-0">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Create New
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <StatCard label="Total Views" value="124.5k" delta="↑ 12%" icon={Eye}>
            <svg className="w-full h-14" viewBox="0 0 240 56" fill="none">
              <polyline
                points="0,40 24,32 48,44 72,26 96,36 120,18 144,30 168,10 192,24 216,14 240,20"
                fill="none"
                stroke="#4338ca"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polygon
                points="0,40 24,32 48,44 72,26 96,36 120,18 144,30 168,10 192,24 216,14 240,20 240,56 0,56"
                fill="#4338ca"
                fillOpacity="0.08"
              />
            </svg>
          </StatCard>

          <StatCard label="Total Likes" value="42.8k" delta="↑ 8%" icon={Heart}>
            <svg className="w-full h-14" viewBox="0 0 240 56" fill="none">
              <polyline
                points="0,44 30,40 60,36 90,34 120,20 150,26 180,10 210,14 240,10"
                fill="none"
                stroke="#9a3412"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polygon
                points="0,44 30,40 60,36 90,34 120,20 150,26 180,10 210,14 240,10 240,56 0,56"
                fill="#c2410c"
                fillOpacity="0.1"
              />
            </svg>
          </StatCard>

          <StatCard label="New Followers" value="1,204" delta={null} icon={Users}>
            <div className="flex items-end gap-2 h-14">
              {[16, 26, 12, 30, 18, 38, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-4 rounded-sm bg-indigo-700"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">This week</p>
          </StatCard>
        </div>

        {/* Recent Blogs + Sidebar cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Recent Blogs */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Recent Blogs</h2>
              <a href="#" className="text-sm font-medium text-indigo-700">
                View All
              </a>
            </div>

            <div className="space-y-1">
              {recentBlogs.map((blog) => (
                <div
                  key={blog.title}
                  className="flex items-center gap-4 py-3.5 border-b border-slate-50 last:border-0"
                >
                  <div className={`w-12 h-12 rounded-lg shrink-0 ${blog.thumbColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{blog.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {blog.status} • {blog.meta}
                    </p>
                  </div>
                  {blog.views && (
                    <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                      <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                      {blog.views}
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${
                      blog.visibility === "Public"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {blog.visibility}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 shrink-0">
                    <MoreVertical className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar cards */}
          <div className="space-y-5">
            {/* Pro plan card */}
            <div className="bg-indigo-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4 text-indigo-200 text-xs font-semibold tracking-wide">
                <Award className="w-4 h-4" strokeWidth={2} />
                PRO PLAN ACTIVE
              </div>
              <h3 className="text-2xl font-bold mb-2 leading-snug">
                Unlock your full potential
              </h3>
              <p className="text-sm text-indigo-100 leading-relaxed mb-6">
                You have access to advanced analytics, priority support, and custom domains.
              </p>

              <div className="flex items-center justify-between text-xs text-indigo-200 mb-2">
                <span>Storage Used</span>
                <span className="text-white font-medium">45GB / 100GB</span>
              </div>
              <div className="w-full h-1.5 bg-indigo-500/40 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-white rounded-full" style={{ width: "45%" }} />
              </div>

              <button className="w-full py-2.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50">
                Manage Subscription
              </button>
            </div>

            {/* Pro tip card */}
            <div className="bg-indigo-50/60 rounded-xl border border-indigo-100 p-6">
              <div className="flex items-center gap-2 mb-3 text-indigo-700 text-sm font-semibold">
                <Lightbulb className="w-4 h-4" strokeWidth={2} />
                Pro Tip
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Articles with custom cover images receive 40% more engagement. Try adding one to your next draft.
              </p>
            </div>
          </div>
        </div>
      </div>
 
  );
}