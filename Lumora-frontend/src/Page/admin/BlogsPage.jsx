import { useEffect, useMemo, useState } from "react";
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
  Loader2,
  Eye,
  FileText,
  ExternalLink,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token")
  );
};

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `${token}`,
        }
      : {}),
  };
};

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(number || 0));
}

function getInitials(name = "Unknown") {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarColor(index) {
  const colors = [
    "bg-rose-100 text-rose-600",
    "bg-indigo-100 text-indigo-600",
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-600",
    "bg-sky-100 text-sky-600",
    "bg-purple-100 text-purple-600",
  ];

  return colors[index % colors.length];
}

function getCoverGradient(index) {
  const gradients = [
    "from-purple-200 to-indigo-100",
    "from-sky-200 to-cyan-100",
    "from-amber-200 to-orange-100",
    "from-emerald-200 to-teal-100",
    "from-rose-200 to-pink-100",
    "from-indigo-200 to-blue-100",
  ];

  return gradients[index % gradients.length];
}

const POST_STATUS_STYLES = {
  PUBLISHED: "bg-indigo-600 text-white",
  DRAFT: "bg-slate-100 text-slate-500",
  SCHEDULED: "bg-amber-50 text-amber-600",
  ARCHIVED: "bg-red-50 text-red-600",

  Published: "bg-indigo-600 text-white",
  Draft: "bg-slate-100 text-slate-500",
  Scheduled: "bg-amber-50 text-amber-600",
  Archived: "bg-red-50 text-red-600",
};

function InitialsAvatar({ name, index }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAvatarColor(
        index,
      )}`}
    >
      {getInitials(name)}
    </div>
  );
}

function Dropdown({ value, options, onChange, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3.5 pr-9 text-sm text-slate-600 outline-none hover:bg-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [selected, setSelected] = useState(new Set());

  const [page, setPage] = useState(1);

  const [actionBlog, setActionBlog] = useState(null);

  /* Delete loading state */
  const [deleting, setDeleting] = useState(false);

  /* Delete error */
  const [deleteError, setDeleteError] = useState("");

  const ITEMS_PER_PAGE = 20;

  /* =======================================================
     Fetch Blogs
  ======================================================= */

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch blogs");
      }

      setBlogs(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Fetch blogs error:", err);

      setError(err.message || "Unable to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     Initial API Request
  ======================================================= */

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* =======================================================
     GET CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(blogs.map((blog) => blog.category?.name).filter(Boolean)),
    ];

    return uniqueCategories.map((item) => ({
      label: item,
      value: item,
    }));
  }, [blogs]);

  /* =======================================================
     FILTER BLOGS
  ======================================================= */

  const filteredBlogs = useMemo(() => {
    const search = query.trim().toLowerCase();

    return blogs.filter((blog) => {
      const authorName = blog.author?.name || "";

      const categoryName = blog.category?.name || "";

      const matchesSearch =
        !search ||
        blog.title?.toLowerCase().includes(search) ||
        blog.slug?.toLowerCase().includes(search) ||
        blog.content?.toLowerCase().includes(search) ||
        blog.excerpt?.toLowerCase().includes(search) ||
        authorName.toLowerCase().includes(search);

      const matchesCategory = !category || categoryName === category;

      const matchesStatus = !status || blog.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, query, category, status]);

  /* =======================================================
     Pagination
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredBlogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  const showingFrom =
    filteredBlogs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const showingTo = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredBlogs.length,
  );

  /* =======================================================
     Reset page
  ======================================================= */

  useEffect(() => {
    setPage(1);
  }, [query, category, status]);

  /* =======================================================
     Selection
  ======================================================= */

  function toggleSelection(id) {
    setSelected((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function toggleSelectAll() {
    const currentIds = paginatedBlogs.map((blog) => blog.id);

    const allSelected =
      currentIds.length > 0 && currentIds.every((id) => selected.has(id));

    setSelected((previous) => {
      const next = new Set(previous);

      if (allSelected) {
        currentIds.forEach((id) => next.delete(id));
      } else {
        currentIds.forEach((id) => next.add(id));
      }

      return next;
    });
  }

  const allCurrentPageSelected =
    paginatedBlogs.length > 0 &&
    paginatedBlogs.every((blog) => selected.has(blog.id));

  function clearSelection() {
    setSelected(new Set());
  }

  /* =======================================================
     Clear Filters
  ======================================================= */

  function clearFilters() {
    setQuery("");
    setCategory("");
    setStatus("");
    setPage(1);
  }

  /* =======================================================
     DELETE BLOG
  ======================================================= */

  const handleDeleteBlog = async (blog) => {
    if (!blog?.slug) {
      console.error("Blog slug not found:", blog);

      setDeleteError("Blog slug is missing. Cannot delete this blog.");

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(
        `${API_BASE_URL}/blog/${encodeURIComponent(blog.slug)}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      let result = {};

      const responseText = await response.text();

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          result = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          result?.message || `Delete failed with status ${response.status}`,
        );
      }

      if (result && result.success === false) {
        throw new Error(result.message || "Failed to delete blog.");
      }

      setBlogs((previousBlogs) =>
        previousBlogs.filter((item) => item.id !== blog.id),
      );

      setSelected((previous) => {
        const next = new Set(previous);

        next.delete(blog.id);

        return next;
      });

      setActionBlog(null);

      console.log("Blog deleted successfully:", blog.slug);
    } catch (err) {
      console.error("Delete blog error:", err);

      setDeleteError(err?.message || "Unable to delete blog.");
    } finally {
      setDeleting(false);
    }
  };

  /* =======================================================
     Loading
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

          <p className="mt-3 text-sm text-slate-500">Loading blogs...</p>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <PageShell
      title="Blogs"
      subtitle="Manage, publish, and track your content."
      cta={
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          Create new post
        </button>
      }
    >
      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-red-700">
              Failed to load blogs
            </p>

            <p className="mt-0.5 text-xs text-red-500">{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchBlogs}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* =================================================
          Delete Error
      ================================================= */}

      {deleteError && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-red-700">Delete failed</p>

            <p className="mt-0.5 text-xs text-red-500">{deleteError}</p>
          </div>

          <button
            type="button"
            onClick={() => setDeleteError("")}
            className="text-xs font-medium text-red-600 hover:text-red-800"
          >
            Close
          </button>
        </div>
      )}

      {/* =================================================
          Search & Filters
      ================================================= */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-2">
          <Dropdown
            value={category}
            onChange={setCategory}
            placeholder="All categories"
            options={categories}
          />

          <Dropdown
            value={status}
            onChange={setStatus}
            placeholder="All status"
            options={[
              {
                label: "Published",
                value: "PUBLISHED",
              },
              {
                label: "Draft",
                value: "DRAFT",
              },
              {
                label: "Scheduled",
                value: "SCHEDULED",
              },
              {
                label: "Archived",
                value: "ARCHIVED",
              },
            ]}
          />

          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            Clear filters
          </button>
        </div>
      </div>

      {/* =================================================
          Table
      ================================================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Table Header */}

        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-slate-600">
            {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "post" : "posts"} total
          </span>

          <div className="flex items-center gap-4 text-slate-400">
            {selected.size > 0 && (
              <>
                <span className="text-xs text-indigo-600">
                  {selected.size} selected
                </span>

                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs hover:text-slate-600"
                >
                  Clear
                </button>
              </>
            )}

            <button
              type="button"
              disabled={selected.size === 0}
              className="flex items-center gap-1.5 text-xs hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Pencil className="h-3.5 w-3.5" />
              Bulk edit
            </button>

            <button
              type="button"
              disabled={selected.size === 0}
              className="flex items-center gap-1.5 text-xs hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>

        {/* =================================================
            Empty State
        ================================================= */}

        {paginatedBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No blogs found
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-400">
              {blogs.length === 0
                ? "You haven't created any blog posts yet."
                : "Try changing your search or filters."}
            </p>

            {(query || category || status) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* =================================================
                Desktop Table
            ================================================= */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-medium text-slate-400">
                    <th className="w-10 px-5 py-3">
                      <input
                        type="checkbox"
                        checked={allCurrentPageSelected}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300"
                      />
                    </th>

                    <th className="px-2 py-3 font-medium">Post title</th>

                    <th className="px-5 py-3 font-medium">Author</th>

                    <th className="px-5 py-3 font-medium">Status</th>

                    <th className="px-5 py-3 font-medium">Views</th>

                    <th className="px-5 py-3 font-medium">Date</th>

                    <th className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBlogs.map((blog, index) => {
                    const authorName = blog.author?.name || "Unknown author";

                    const statusStyle =
                      POST_STATUS_STYLES[blog.status] ||
                      "bg-slate-100 text-slate-500";

                    return (
                      <tr
                        key={blog.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                      >
                        {/* Checkbox */}

                        <td className="px-5 py-3.5">
                          <input
                            type="checkbox"
                            checked={selected.has(blog.id)}
                            onChange={() => toggleSelection(blog.id)}
                            className="rounded border-slate-300"
                          />
                        </td>

                        {/* Title */}

                        <td className="px-2 py-3.5">
                          <div className="flex items-center gap-3">
                            {blog.coverImage ? (
                              <img
                                src={blog.coverImage}
                                alt={blog.title || "Blog cover"}
                                className="h-10 w-14 shrink-0 rounded-md object-cover"
                              />
                            ) : (
                              <div
                                className={`h-10 w-14 shrink-0 rounded-md bg-gradient-to-br ${getCoverGradient(
                                  index,
                                )}`}
                              />
                            )}

                            <div className="min-w-0">
                              <p className="max-w-[280px] truncate font-medium text-slate-800">
                                {blog.title}
                              </p>

                              <p className="mt-0.5 max-w-[280px] truncate text-xs text-slate-400">
                                /{blog.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Author */}

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <InitialsAvatar name={authorName} index={index} />

                            <span className="max-w-[150px] truncate text-slate-600">
                              {authorName}
                            </span>
                          </div>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />

                            {blog.status}
                          </span>
                        </td>

                        {/* Views */}

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Eye className="h-3.5 w-3.5 text-slate-400" />

                            {formatNumber(blog.viewCount)}
                          </div>
                        </td>

                        {/* Date */}

                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-3.5">
                          <div className="flex justify-end text-slate-400">
                            <button
                              type="button"
                              onClick={() =>
                                setActionBlog(
                                  actionBlog?.id === blog.id ? null : blog,
                                )
                              }
                              className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-600"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* =================================================
                Mobile Cards
            ================================================= */}

            <div className="divide-y divide-slate-100 md:hidden">
              {paginatedBlogs.map((blog, index) => {
                const authorName = blog.author?.name || "Unknown author";

                const statusStyle =
                  POST_STATUS_STYLES[blog.status] ||
                  "bg-slate-100 text-slate-500";

                return (
                  <div key={blog.id} className="p-4">
                    <div className="flex gap-3">
                      {/* Checkbox */}

                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selected.has(blog.id)}
                          onChange={() => toggleSelection(blog.id)}
                          className="rounded border-slate-300"
                        />
                      </div>

                      {/* Cover */}

                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="h-16 w-20 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          className={`h-16 w-20 shrink-0 rounded-lg bg-gradient-to-br ${getCoverGradient(
                            index,
                          )}`}
                        />
                      )}

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">
                            {blog.title}
                          </h3>

                          <button
                            type="button"
                            onClick={() => setActionBlog(blog)}
                            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {authorName}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${statusStyle}`}
                          >
                            {blog.status}
                          </span>

                          <span className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Eye className="h-3 w-3" />

                            {formatNumber(blog.viewCount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* =================================================
            Pagination
        ================================================= */}

        {filteredBlogs.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-500">
              Showing {showingFrom} to {showingTo} of {filteredBlogs.length}{" "}
              entries
            </span>

            <div className="flex items-center gap-1">
              {/* Previous */}

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) => index + 1,
              )
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2),
                )
                .map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-8 w-8 rounded-md text-sm font-medium ${
                      pageNumber === currentPage
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

              {/* Next */}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =================================================
          Action Modal
      ================================================= */}

      {actionBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!deleting) {
                setActionBlog(null);
              }
            }}
          />

          {/* Modal */}

          <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Blog actions
                </h3>

                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {actionBlog.title}
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  /{actionBlog.slug}
                </p>
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setActionBlog(null)}
                className="text-xl text-slate-400 hover:text-slate-600 disabled:opacity-40"
              >
                ×
              </button>
            </div>

            {/* Delete error inside modal */}

            {deleteError && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
                <p className="text-xs text-red-600">{deleteError}</p>
              </div>
            )}

            <div className="mt-5 space-y-2">
              {/* Edit */}

              <button
                type="button"
                disabled={deleting}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                onClick={() => {
                  console.log("Edit blog:", actionBlog.id);

                  setActionBlog(null);
                }}
              >
                <Pencil className="h-4 w-4" />
                Edit blog
              </button>

              {/* View */}

              <button
                type="button"
                disabled={deleting}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                onClick={() => {
                  console.log("View blog:", actionBlog.slug);

                  setActionBlog(null);
                }}
              >
                <ExternalLink className="h-4 w-4" />
                View blog
              </button>

              {/* DELETE */}

              <button
                type="button"
                disabled={deleting}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => handleDeleteBlog(actionBlog)}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {deleting ? "Deleting..." : "Delete blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
