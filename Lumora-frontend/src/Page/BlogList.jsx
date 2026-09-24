import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const fallbackImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=900&fit=crop",
  "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
];
const filters = ["All", "Design", "Tech", "Business"];
const BLOG_LIST_CACHE_KEY = "lumora:blog-list:v1";
const BLOG_LIST_CACHE_TTL = 60 * 1000;

const readBlogListCache = () => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(BLOG_LIST_CACHE_KEY));

    if (!cached || !Array.isArray(cached.blogs) || !Array.isArray(cached.authors)) {
      return null;
    }

    return {
      ...cached,
      isFresh: Date.now() - cached.timestamp < BLOG_LIST_CACHE_TTL,
    };
  } catch {
    return null;
  }
};

const writeBlogListCache = (blogs, authors) => {
  try {
    sessionStorage.setItem(
      BLOG_LIST_CACHE_KEY,
      JSON.stringify({ blogs, authors, timestamp: Date.now() }),
    );
  } catch {
    // Caching is optional; the API response is still used normally.
  }
};

const cleanImageUrl = (value) => {
  if (!value) return "";
  const markdownMatch = value.match(/\]\((https?:\/\/[^)]+)\)/);
  return markdownMatch?.[1] || value;
};
const getDescription = (blog) =>
  (blog.excerpt || blog.content || "No description available.")
    .replace(/\s+/g, " ")
    .trim();
const getReadTime = (content = "") =>
  `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min read`;
const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "Unpublished";
const initials = (name = "Lumora writer") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Author({ blog, light = false }) {
  const name = blog.author?.name || "Lumora writer";
  return (
    <div
      className={`flex items-center gap-2 text-sm ${light ? "text-slate-200" : "text-slate-600"}`}
    >
      <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
        {initials(name)}
      </span>
      <span className={light ? "font-medium text-white" : ""}>{name}</span>
    </div>
  );
}

const getToken = () => localStorage.getItem("accessToken");

function AuthorCard({ author, onFollow }) {
  const [following, setFollowing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const profile = author.profile || {};

  React.useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch(`${API_BASE_URL}/user/${author.id}/follow/status`, {
      headers: { Authorization: token },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) setFollowing(result.data.following);
      })
      .catch(() => {});
  }, [author.id]);

  const handleFollow = async () => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/user/${author.id}/follow`, {
        method: "POST",
        headers: { Authorization: token },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setFollowing(result.data.following);
      onFollow(author.id, result.data.followers);
    } catch (error) {
      console.error("Follow author error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 border-t border-indigo-100/80 py-3 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-2">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={author.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
            {initials(author.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-900">
            {author.name}
          </p>
          <p className="truncate text-[10px] text-slate-500">
            {profile.profession || "Lumora writer"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleFollow}
        disabled={loading}
        className="shrink-0 rounded-full border border-indigo-200 px-2.5 py-1 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
}

export default function BlogList() {
  const [blogs, setBlogs] = React.useState([]);
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [authors, setAuthors] = React.useState([]);

  React.useEffect(() => {
    const loadBlogs = async () => {
      if (!API_BASE_URL) {
        setError("The API base URL is not configured.");
        setLoading(false);
        return;
      }

      const cached = readBlogListCache();
      if (cached) {
        setBlogs(cached.blogs);
        setAuthors(cached.authors);
        setLoading(false);
        if (cached.isFresh) return;
      }

      try {
        const [blogsResponse, authorsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/blog`),
          fetch(`${API_BASE_URL}/user/authors`),
        ]);
        const result = await blogsResponse.json();
        const authorsResult = await authorsResponse.json();
        if (!blogsResponse.ok || !result.success)
          throw new Error(result.message || "Failed to load blogs.");
        const nextBlogs = Array.isArray(result.data) ? result.data : [];
        const nextAuthors = Array.isArray(authorsResult.data)
          ? authorsResult.data
          : [];
        setBlogs(nextBlogs);
        setAuthors(nextAuthors);
        writeBlogListCache(nextBlogs, nextAuthors);
      } catch (requestError) {
        setError(requestError.message || "Unable to load blogs right now.");
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  const visibleBlogs = blogs.filter((blog) =>
    activeFilter === "All" ? true : blog.status === activeFilter.toUpperCase(),
  );
  const featuredBlog = visibleBlogs[0];
  const sideBlogs = visibleBlogs.slice(1, 3);
  const articleBlogs = visibleBlogs.slice(0, 3);

  const updateAuthorFollowers = (authorId, followers) => {
    setAuthors((previous) =>
      previous.map((author) =>
        author.id === authorId
          ? { ...author, _count: { ...author._count, followers } }
          : author,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f4fb] text-slate-900 font-sans">
      <main className="max-w-7xl mx-auto px-6">
        <section className="pt-10 pb-14">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-1">
                TOP STORIES
              </p>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Trending Now
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                aria-label="Previous stories"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                aria-label="Next stories"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-12 text-center text-slate-500">
              Loading stories...
            </div>
          )}
          {error && !loading && (
            <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && visibleBlogs.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center text-slate-500">
              No blogs found.
            </div>
          )}

          {!loading && !error && featuredBlog && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <Link
                to={`/blog/${featuredBlog.slug}`}
                className="lg:col-span-2 relative rounded-2xl overflow-hidden h-[480px] group"
              >
                <img
                  src={
                    cleanImageUrl(featuredBlog.coverImage) || fallbackImages[0]
                  }
                  alt={featuredBlog.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {featuredBlog.status}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h2 className="text-white text-3xl font-bold leading-tight mb-4 max-w-xl">
                    {featuredBlog.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Author blog={featuredBlog} light />
                    <span className="text-slate-400">•</span>
                    <span className="text-sm text-slate-200">
                      {formatDate(
                        featuredBlog.publishedAt || featuredBlog.createdAt,
                      )}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-sm text-slate-200">
                      {getReadTime(featuredBlog.content)}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="flex flex-col gap-6">
                {sideBlogs.map((blog, index) => (
                  <Link
                    to={`/blog/${blog.slug}`}
                    key={blog.id}
                    className="flex-1 rounded-2xl bg-white border border-slate-100 p-6 flex flex-col justify-between hover:shadow-sm transition-shadow"
                  >
                    <div>
                      <span className="inline-block text-white text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 bg-orange-600">
                        {blog.status}
                      </span>
                      <h3 className="text-lg font-bold leading-snug mb-3">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {getDescription(blog)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-5">
                      <Author blog={blog} />
                      <img
                        src={
                          cleanImageUrl(blog.coverImage) ||
                          fallbackImages[index + 1]
                        }
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {authors.length > 0 && (
          <section className="border-t border-slate-200 py-12">
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-1">
                MEET THE WRITERS
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Featured Authors
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {authors.slice(0, 6).map((author) => (
                <AuthorCard
                  key={author.id}
                  author={author}
                  onFollow={updateAuthorFollowers}
                />
              ))}
            </div>
          </section>
        )}

        <section className="pb-20">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">
              Latest Articles
            </h2>
            <div className="flex items-center gap-1.5">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${activeFilter === filter ? "bg-indigo-100 font-semibold text-indigo-700" : "text-slate-600 hover:bg-white"}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_212px]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {articleBlogs[0] && (
                <Link
                  to={`/blog/${articleBlogs[0].slug}`}
                  className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md md:row-span-2"
                >
                  <div className="aspect-[1.55] overflow-hidden bg-slate-200">
                    <img
                      src={
                        cleanImageUrl(articleBlogs[0].coverImage) ||
                        fallbackImages[0]
                      }
                      alt={articleBlogs[0].title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                      {articleBlogs[0].category?.name || "Productivity"}{" "}
                      <span className="px-1 text-slate-300">·</span>{" "}
                      <span className="normal-case font-normal text-slate-600">
                        {getReadTime(articleBlogs[0].content)}
                      </span>
                    </p>
                    <h3 className="text-xl font-bold leading-tight text-slate-950">
                      {articleBlogs[0].title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {getDescription(articleBlogs[0])}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <Author blog={articleBlogs[0]} />
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Heart size={12} />{" "}
                          {articleBlogs[0]._count?.likes ?? 0}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageCircle size={12} />{" "}
                          {articleBlogs[0]._count?.comments ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {articleBlogs[1] && (
                <Link
                  to={`/blog/${articleBlogs[1].slug}`}
                  className="group flex min-h-[215px] flex-col justify-between rounded-xl border border-slate-200/80 bg-indigo-50/70 p-4 transition-colors hover:bg-indigo-50"
                >
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-rose-600">
                      {articleBlogs[1].category?.name || "Essay"}{" "}
                      <span className="px-1 text-indigo-200">·</span>{" "}
                      <span className="normal-case font-normal text-slate-600">
                        {getReadTime(articleBlogs[1].content)}
                      </span>
                    </p>
                    <h3 className="text-xl font-bold leading-tight text-slate-950">
                      {articleBlogs[1].title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-700">
                      {getDescription(articleBlogs[1])}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Author blog={articleBlogs[1]} />
                    <Bookmark size={15} className="text-slate-600" />
                  </div>
                </Link>
              )}

              {articleBlogs[2] && (
                <Link
                  to={`/blog/${articleBlogs[2].slug}`}
                  className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[2.2] overflow-hidden bg-slate-200">
                    <img
                      src={
                        cleanImageUrl(articleBlogs[2].coverImage) ||
                        fallbackImages[2]
                      }
                      alt={articleBlogs[2].title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3.5">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                      {articleBlogs[2].category?.name || "Web3"}{" "}
                      <span className="px-1 text-slate-300">·</span>{" "}
                      <span className="normal-case font-normal text-slate-600">
                        {getReadTime(articleBlogs[2].content)}
                      </span>
                    </p>
                    <h3 className="line-clamp-2 text-lg font-bold leading-tight text-slate-950">
                      {articleBlogs[2].title}
                    </h3>
                  </div>
                </Link>
              )}
            </div>

            {authors.length > 0 && (
              <aside className="h-fit rounded-xl bg-indigo-100/80 p-3.5">
                <h3 className="border-b border-indigo-200 pb-2.5 text-sm font-bold text-slate-950">
                  Popular Authors
                </h3>
                <div className="mt-2.5">
                  {authors.slice(0, 3).map((author) => (
                    <AuthorCard
                      key={author.id}
                      author={author}
                      onFollow={updateAuthorFollowers}
                    />
                  ))}
                </div>
              </aside>
            )}
          </div>
          {!loading &&
            !error &&
            visibleBlogs.length > 1 &&
            articleBlogs.length === 0 && (
              <p className="text-slate-500">No articles match this filter.</p>
            )}
        </section>
      </main>
    </div>
  );
}
