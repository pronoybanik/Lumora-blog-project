import { useState } from "react";
import { CheckCircle2, Clock3, FileText, PenLine, ShieldCheck } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem("accessToken");

const steps = [
  { icon: PenLine, title: "Share your perspective", text: "Write thoughtful stories, guides, and ideas for the Lumora community." },
  { icon: ShieldCheck, title: "Get reviewed", text: "Our team reviews your application and confirms that you are ready to publish." },
  { icon: FileText, title: "Publish with confidence", text: "Approved authors can publish premium blogs and grow their audience." },
];

export default function AuthorApplication() {
  const { user, loading, refreshUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">Loading your author profile...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  const status = user.authorStatus || "NONE";
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING";

  const apply = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/user/author/apply`, {
        method: "POST",
        headers: { Authorization: `${getToken()}`, "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to submit your application.");
      await refreshUser();
      setMessage({ type: "success", text: "Your application has been submitted. We’ll let you know once it has been reviewed." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/profilePage" className="text-sm font-medium text-indigo-700 hover:text-indigo-900">← Back to profile</Link>

        <section className="mt-6 overflow-hidden rounded-3xl bg-indigo-700 px-7 py-10 text-white shadow-xl shadow-indigo-100 sm:px-12 sm:py-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider"><CheckCircle2 className="h-4 w-4" /> Lumora author program</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Turn your ideas into stories people remember.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-indigo-100">Become a verified Lumora author and share your expertise with readers who are curious, thoughtful, and ready to learn.</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Icon className="h-5 w-5" /></div>
              <h2 className="mt-5 font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className={`rounded-xl p-3 ${isApproved ? "bg-emerald-50 text-emerald-600" : isPending ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-700"}`}>
              {isApproved ? <CheckCircle2 className="h-6 w-6" /> : isPending ? <Clock3 className="h-6 w-6" /> : <PenLine className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your application status</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{isApproved ? "You’re a verified author" : isPending ? "Your application is under review" : "Ready to become an author?"}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{isApproved ? "You can now publish premium blogs for Lumora readers." : isPending ? "An administrator is reviewing your application. You do not need to submit it again." : "Submit your application to unlock verified author access."}</p>
              {message && <p className={`mt-4 rounded-lg px-3 py-2 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{message.text}</p>}
              {!isApproved && !isPending && <button onClick={apply} disabled={submitting} className="mt-5 rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Submitting..." : "Apply to become an author"}</button>}
              {isApproved && <Link to="/createBlogs" className="mt-5 inline-flex rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800">Write your first blog</Link>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
