import { useEffect, useMemo, useState } from "react";
import { Check, Clock3, Search, UserRound, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem("accessToken");

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
};

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
};

export default function AuthorsList() {
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState(null);

  const fetchApplications = async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/user/author/applications`, {
        headers: { Authorization: token },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to load authors");
      setApplications(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load authors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesQuery = !normalizedQuery || application.name?.toLowerCase().includes(normalizedQuery) || application.email?.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "ALL" || application.authorStatus === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [applications, query, statusFilter]);

  const reviewApplication = async (id, decision) => {
    try {
      setReviewingId(id);
      const response = await fetch(`${API_URL}/user/author/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: getToken() },
        body: JSON.stringify({ decision }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to review application");
      await fetchApplications();
    } catch (requestError) {
      setError(requestError.message || "Unable to review application");
    } finally {
      setReviewingId(null);
    }
  };

  const pendingCount = applications.filter((application) => application.authorStatus === "PENDING").length;
  const approvedCount = applications.filter((application) => application.authorStatus === "APPROVED").length;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Authors</h1>
          <p className="mt-1 text-sm text-slate-500">Review applications and manage verified Lumora authors.</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-100 bg-white p-5"><div className="flex items-center gap-3 text-amber-700"><Clock3 className="h-5 w-5" /><span className="text-sm font-medium">Pending applications</span></div><p className="mt-3 text-3xl font-semibold text-slate-900">{pendingCount}</p></div>
          <div className="rounded-xl border border-emerald-100 bg-white p-5"><div className="flex items-center gap-3 text-emerald-700"><Check className="h-5 w-5" /><span className="text-sm font-medium">Verified authors</span></div><p className="mt-3 text-3xl font-semibold text-slate-900">{approvedCount}</p></div>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-indigo-400"><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Verified</option></select>
        </div>

        {error && <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={fetchApplications} className="font-semibold underline">Retry</button></div>}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {loading ? <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">Loading authors...</div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs text-slate-400"><th className="px-5 py-3 font-medium">Applicant</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Blogs</th><th className="px-5 py-3 font-medium">Applied</th><th className="px-5 py-3 text-right font-medium">Actions</th></tr></thead><tbody>
            {filteredApplications.map((application) => <tr key={application.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"><td className="px-5 py-4"><div className="flex items-center gap-3">{application.profile?.avatar ? <img src={application.profile.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><UserRound className="h-4 w-4" /></span>}<div><p className="font-medium text-slate-800">{application.name}</p><p className="text-xs text-slate-500">{application.email}</p></div></div></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[application.authorStatus]}`}>{application.authorStatus === "APPROVED" ? "VERIFIED" : application.authorStatus}</span></td><td className="px-5 py-4 text-slate-500">{application._count?.blogs ?? 0}</td><td className="px-5 py-4 text-slate-500">{formatDate(application.authorAppliedAt)}</td><td className="px-5 py-4 text-right">{application.authorStatus === "PENDING" ? <div className="flex justify-end gap-2"><button disabled={reviewingId === application.id} onClick={() => reviewApplication(application.id, "APPROVED")} className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"><Check className="h-3.5 w-3.5" />Approve</button><button disabled={reviewingId === application.id} onClick={() => reviewApplication(application.id, "REJECTED")} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-50"><X className="h-3.5 w-3.5" />Reject</button></div> : <span className="text-xs font-medium text-emerald-600">Verified author</span>}</td></tr>)}
            {!filteredApplications.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">No authors match the current filters.</td></tr>}
          </tbody></table></div>}
        </div>
      </div>
    </div>
  );
}
