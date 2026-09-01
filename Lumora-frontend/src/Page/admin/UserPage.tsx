import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
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

function Pagination({ page, totalPages, onChange, count, total, noun }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 text-sm">
      <span className="text-slate-500">
        Showing {count} of {total} {noun}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-md border border-slate-200 p-1.5 text-slate-400 disabled:opacity-40 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`h-8 w-8 rounded-md text-sm font-medium ${
              n === page
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded-md border border-slate-200 p-1.5 text-slate-400 disabled:opacity-40 hover:bg-slate-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const ROLE_STYLES = {
  Admin: "bg-indigo-50 text-indigo-600",
  Editor: "bg-sky-50 text-sky-600",
  Writer: "bg-amber-50 text-amber-700",
  Viewer: "bg-slate-100 text-slate-600",
};

const STATUS_STYLES = {
  Active: "bg-emerald-50 text-emerald-600",
  Suspended: "bg-slate-100 text-slate-500",
  Invited: "bg-amber-50 text-amber-600",
};

const AVATAR_TONES = [
  "bg-rose-100 text-rose-600",
  "bg-indigo-100 text-indigo-600",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-purple-100 text-purple-600",
];

const USERS = [
  { name: "Sarah Jenkins", email: "sarah.j@lumora.co", role: "Admin", status: "Active", joined: "Oct 24, 2023" },
  { name: "Marcus Rhide", email: "marcus@lumora.co", role: "Editor", status: "Active", joined: "Nov 02, 2023" },
  { name: "Elena Vance", email: "elena.v@lumora.co", role: "Writer", status: "Suspended", joined: "Dec 15, 2023" },
  { name: "David Chen", email: "david.c@lumora.co", role: "Editor", status: "Active", joined: "Jan 08, 2024" },
  { name: "Priya Anand", email: "priya.a@lumora.co", role: "Writer", status: "Active", joined: "Feb 19, 2024" },
  { name: "Tom Okafor", email: "tom.o@lumora.co", role: "Viewer", status: "Invited", joined: "Mar 03, 2024" },
  { name: "Nina Kowalski", email: "nina.k@lumora.co", role: "Admin", status: "Active", joined: "Mar 27, 2024" },
  { name: "Jorge Salinas", email: "jorge.s@lumora.co", role: "Writer", status: "Suspended", joined: "Apr 14, 2024" },
  { name: "Aiko Tanaka", email: "aiko.t@lumora.co", role: "Editor", status: "Active", joined: "May 06, 2024" },
  { name: "Liam Foster", email: "liam.f@lumora.co", role: "Viewer", status: "Active", joined: "Jun 21, 2024" },
  { name: "Grace Odum", email: "grace.o@lumora.co", role: "Writer", status: "Invited", joined: "Jul 30, 2024" },
  { name: "Ben Castillo", email: "ben.c@lumora.co", role: "Editor", status: "Active", joined: "Aug 12, 2024" },
];

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const filtered = useMemo(
    () =>
      USERS.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PageShell
      title="Users"
      subtitle="Manage your team members and their account permissions here."
      cta={
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">
          <Plus className="h-4 w-4" />
          Add new user
        </button>
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search users by name or email…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex gap-2">
          <Dropdown label="All roles" />
          <Dropdown label="All statuses" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium text-slate-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Join date</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((u, i) => (
              <tr key={u.email} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {initialsAvatar(u.name, AVATAR_TONES[i % AVATAR_TONES.length])}
                    <div>
                      <div className="font-medium text-slate-800">{u.name}</div>
                      <div className="text-xs text-indigo-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLES[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[u.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{u.joined}</td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1 text-slate-400">
                    <button className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-600">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 hover:bg-rose-50 hover:text-rose-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">
                  No users match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
          count={shown.length}
          total={filtered.length}
          noun="users"
        />
      </div>
    </PageShell>
  );
}