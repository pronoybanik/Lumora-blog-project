import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

// const API_URL = "http://localhost:5000/api/v1";
const API_URL = import.meta.env.VITE_API_BASE_URL;

function initialsAvatar(name = "", tone) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tone}`}
    >
      {initials || "U"}
    </div>
  );
}

function Dropdown({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white px-3.5 py-2 pr-9 text-sm text-slate-600 outline-none hover:bg-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">{label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
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

const ROLE_STYLES = {
  ADMIN: "bg-indigo-50 text-indigo-600",
  AUTHOR: "bg-amber-50 text-amber-700",
  USER: "bg-sky-50 text-sky-600",
};

const AVATAR_TONES = [
  "bg-rose-100 text-rose-600",
  "bg-indigo-100 text-indigo-600",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-purple-100 text-purple-600",
];

function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getAuthToken() {
  return localStorage.getItem("accessToken");
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 20;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/user/allUser`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch users");
      }

      if (!result?.success) {
        throw new Error(result?.message || "Failed to fetch users");
      }

      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Get all users error:", err);

      setError(err?.message || "Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Initial API call                                                  */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------------------------------------------------------- */
  /* Search + Filter                                                   */
  /* ---------------------------------------------------------------- */

  const filtered = useMemo(() => {
    const search = query.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !search ||
        user?.name?.toLowerCase().includes(search) ||
        user?.email?.toLowerCase().includes(search);

      const matchesRole = !roleFilter || user?.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, query, roleFilter]);

  /* ---------------------------------------------------------------- */
  /* Pagination                                                        */
  /* ---------------------------------------------------------------- */

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ---------------------------------------------------------------- */
  /* Reset page when filtering                                         */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    setPage(1);
  }, [query, roleFilter]);

  /* ---------------------------------------------------------------- */
  /* Delete user                                                       */
  /* ---------------------------------------------------------------- */

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );

    if (!confirmed) return;

    try {
      const token = getAuthToken();

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((item) => item.id !== user.id));

      alert("User deleted successfully.");
    } catch (err) {
      console.error("Delete user error:", err);

      alert(err?.message || "Failed to delete user.");
    }
  };

  /* ---------------------------------------------------------------- */
  /* Edit user                                                         */
  /* ---------------------------------------------------------------- */

  const handleEdit = (user) => {
    console.log("Edit user:", user);

    /*
     * Connect this with your edit page/modal.
     *
     * Example:
     *
     * navigate(`/admin/users/${user.id}/edit`);
     */
  };

  /* ---------------------------------------------------------------- */
  /* Loading                                                            */
  /* ---------------------------------------------------------------- */

  if (loading) {
    return (
      <PageShell
        title="Users"
        subtitle="Manage your team members and their account permissions here."
      >
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

            <p className="mt-3 text-sm text-slate-500">Loading users...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Error                                                              */
  /* ---------------------------------------------------------------- */

  if (error) {
    return (
      <PageShell
        title="Users"
        subtitle="Manage your team members and their account permissions here."
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>

          <button
            onClick={fetchUsers}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Try again
          </button>
        </div>
      </PageShell>
    );
  }

  /* ---------------------------------------------------------------- */
  /* UI                                                                 */
  /* ---------------------------------------------------------------- */

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
      {/* Search + Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex gap-2">
          <Dropdown
            label="All roles"
            value={roleFilter}
            onChange={setRoleFilter}
            options={["ADMIN", "AUTHOR", "USER"]}
          />
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
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
              {shown.map((user, i) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {initialsAvatar(
                        user.name,
                        AVATAR_TONES[i % AVATAR_TONES.length],
                      )}

                      <div>
                        <div className="font-medium text-slate-800">
                          {user.name}
                        </div>

                        <div className="text-xs text-indigo-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        ROLE_STYLES[user.role] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      Active
                    </span>
                  </td>

                  {/* Join date */}
                  <td className="px-5 py-3.5 text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1 text-slate-400">
                      <button
                        onClick={() => handleEdit(user)}
                        className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-600"
                        title="Edit user"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(user)}
                        className="rounded-md p-1.5 hover:bg-rose-50 hover:text-rose-500"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* No users */}
              {shown.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    No users match "{query}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
