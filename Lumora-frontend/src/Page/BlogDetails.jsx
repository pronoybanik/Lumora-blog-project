import React from "react";
import { ArrowLeft, Eye, Heart, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const fallbackImage =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=900&fit=crop";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "Unpublished";

const getReadTime = (content = "") =>
  `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min read`;

const cleanImageUrl = (value) => {
  if (!value) return fallbackImage;
  const markdownMatch = value.match(/\]\((https?:\/\/[^)]+)\)/);
  return markdownMatch?.[1] || value;
};

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [liked, setLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(0);
  const [likeLoading, setLikeLoading] = React.useState(false);

  React.useEffect(() => {
    const loadBlog = async () => {
      if (!API_BASE_URL || !slug) {
        setError("The blog could not be loaded.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load this blog.");
        }
        setBlog(result.data);
        setLikes(result.data._count?.likes ?? 0);

        const token = localStorage.getItem("accessToken");
        if (token) {
          const likeResponse = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}/like`, {
            headers: { Authorization: token },
          });
          const likeResult = await likeResponse.json();
          if (likeResponse.ok && likeResult.success) setLiked(likeResult.data.liked);
        }
      } catch (requestError) {
        setError(requestError.message || "Unable to load this blog right now.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return <main className="min-h-screen bg-[#f4f4fb] px-6 py-20 text-center text-slate-500">Loading article...</main>;
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-[#f4f4fb] px-6 py-20 text-center">
        <p className="mb-6 text-red-700">{error || "Blog not found."}</p>
        <Link to="/blogList" className="inline-flex items-center gap-2 font-medium text-indigo-700">
          <ArrowLeft size={16} /> Back to blogs
        </Link>
      </main>
    );
  }

  const commentCount = blog._count?.comments ?? blog.comments?.length ?? 0;

  const handleLike = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLikeLoading(true);
      const response = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}/like`, {
        method: "POST",
        headers: { Authorization: token },
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      setLiked(result.data.liked);
      setLikes(result.data.likes);
    } catch (requestError) {
      setError(requestError.message || "Unable to update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f4fb] text-slate-900">
      <article className="mx-auto max-w-4xl px-6 py-10 pb-20">
        <Link to="/blogList" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-indigo-700 hover:text-indigo-900">
          <ArrowLeft size={16} /> Back to blogs
        </Link>

        <img src={cleanImageUrl(blog.coverImage)} alt={blog.title} className="mb-8 h-[280px] w-full rounded-3xl object-cover md:h-[440px]" />

        <div className="mb-8">
          <span className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">{blog.status}</span>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">{blog.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{blog.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="font-medium text-slate-800">{blog.author?.name || "Lumora writer"}</span>
            <span>•</span>
            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            <span>•</span>
            <span>{getReadTime(blog.content)}</span>
            <span className="inline-flex items-center gap-1"><Eye size={15} /> {blog.viewCount ?? 0}</span>
            <span className="inline-flex items-center gap-1"><MessageCircle size={15} /> {commentCount}</span>
            <button type="button" onClick={handleLike} disabled={likeLoading} className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-medium ${liked ? "bg-rose-100 text-rose-700" : "bg-white text-slate-600"} disabled:opacity-50`}>
              <Heart size={15} fill={liked ? "currentColor" : "none"} /> {likes}
            </button>
          </div>
        </div>

        <div className="whitespace-pre-wrap border-t border-slate-200 pt-8 text-lg leading-8 text-slate-700">{blog.content}</div>
      </article>
    </main>
  );
}