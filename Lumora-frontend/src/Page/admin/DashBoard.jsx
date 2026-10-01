import { useEffect, useState } from "react";
import {
  Eye,
  Heart,
  Users,
  MoreVertical,
  Lightbulb,
  Loader2,
  CreditCard,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  return token
    ? { Authorization: token, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

const formatMoney = (value, currency = "BDT") =>
  `${currency} ${Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));

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
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load dashboard data");
        }

        setDashboard(result.data);
      } catch (dashboardError) {
        setError(dashboardError.message);
      }
    };

    loadDashboard();
  }, []);

  if (error) {
    return <div className="px-10 py-10 text-sm text-red-600">{error}</div>;
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  const { stats, recentBlogs, paymentHistory } = dashboard;

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
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Views" value={formatNumber(stats.totalViews)} icon={Eye}>
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

          <StatCard label="Total Likes" value={formatNumber(stats.totalLikes)} icon={Heart}>
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

          <StatCard label="Total Followers" value={formatNumber(stats.totalFollowers)} icon={Users}>
            <div className="flex items-end gap-2 h-14">
              {[16, 26, 12, 30, 18, 38, 30].map((h, index) => (
                <div
                  key={index}
                  className="w-4 rounded-sm bg-indigo-700"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">{formatNumber(stats.totalBlogs)} total blogs</p>
          </StatCard>

          <StatCard label="Total Paid (TK)" value={formatMoney(stats.totalPaid)} icon={CreditCard}>
            <p className="text-xs text-slate-400 mt-2">{formatNumber(stats.paidPayments)} successful payments</p>
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
                  <div
                    className="w-12 h-12 rounded-lg shrink-0 bg-slate-200 bg-cover bg-center"
                    style={blog.coverImage ? { backgroundImage: `url(${blog.coverImage})` } : undefined}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{blog.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {blog.status} • {formatDate(blog.createdAt)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                    <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                    {formatNumber(blog.viewCount)}
                  </span>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${
                      blog.status === "PUBLISHED"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {blog.status === "PUBLISHED" ? "Public" : "Private"}
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
            <div className="bg-indigo-700 rounded-xl p-6 text-white">
              <p className="text-xs font-semibold tracking-wide text-indigo-200 mb-4">CONTENT OVERVIEW</p>
              <h3 className="text-2xl font-bold mb-2 leading-snug">
                {formatNumber(stats.totalBlogs)} total blogs
              </h3>
              <p className="text-sm text-indigo-100 leading-relaxed mb-6">
                Keep an eye on your publication progress and audience activity.
              </p>

              <div className="flex items-center justify-between text-xs text-indigo-200 mb-2">
                <span>Published</span>
                <span className="text-white font-medium">{formatNumber(stats.publishedBlogs)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-indigo-200 mb-6">
                <span>Drafts</span>
                <span className="text-white font-medium">{formatNumber(stats.draftBlogs)}</span>
              </div>
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

        <div className="mt-6 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
            <span className="text-sm text-slate-400">Latest transactions</span>
          </div>

          {paymentHistory.length === 0 ? (
            <p className="py-6 text-sm text-slate-400">No payment history yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Plan</th>
                    <th className="pb-3 font-medium">Transaction</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 text-right font-medium">Amount</th>
                    <th className="pb-3 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3">
                        <p className="font-medium text-slate-800">{payment.user.name}</p>
                        <p className="text-xs text-slate-400">{payment.user.email}</p>
                      </td>
                      <td className="py-3 capitalize text-slate-600">{payment.plan}</td>
                      <td className="py-3 font-mono text-xs text-slate-500">{payment.transactionId}</td>
                      <td className="py-3 text-slate-500">{formatDate(payment.createdAt)}</td>
                      <td className="py-3 text-right font-medium text-slate-800">
                        {formatMoney(payment.amount, payment.currency)}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          payment.status === "PAID"
                            ? "bg-emerald-50 text-emerald-700"
                            : payment.status === "INITIATED"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
 
  );
}