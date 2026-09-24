
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const fallbackImage = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop";

const getReadTime = (content = "") =>
  `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min read`;

const getDescription = (blog) =>
  (blog.excerpt || blog.content || "No description available.").replace(/\s+/g, " ").trim();

const getInitials = (name = "Lumora writer") =>
  name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();


const FeaturedStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      if (!API_BASE_URL) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/blog`);
        const result = await response.json();
        if (response.ok && result.success) {
          setStories((Array.isArray(result.data) ? result.data : [])
            .filter((blog) => blog.status === "PUBLISHED")
            .slice(0, 3));
        }
      } catch (error) {
        console.error("Featured stories error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-wide text-indigo-600 mb-1">
            CURATED COLLECTION
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            Featured Stories
          </h2>
        </div>
        <Link
          to="/blogList"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View all <span aria-hidden>&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <p className="text-sm text-slate-500">Loading featured stories...</p>}
        {!loading && stories.length === 0 && <p className="text-sm text-slate-500">No published stories yet.</p>}
        {stories.map((story) => (
          <article
            key={story.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow"
          >
            <Link to={`/blog/${encodeURIComponent(story.slug)}`} className="block">
            <div className="relative h-44">
              <img
                src={story.coverImage || fallbackImage}
                alt={story.title || "Featured story"}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-white/90 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                {story.category?.name || "Featured"}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-slate-900 leading-snug mb-2">
                {story.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                {getDescription(story)}
              </p>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-700">
                  {getInitials(story.author?.name)}
                </span>
                <span className="text-xs text-slate-600">{story.author?.name || "Lumora writer"}</span>
                <span className="text-xs text-slate-300">&middot;</span>
                <span className="text-xs text-slate-400">{getReadTime(story.content)}</span>
              </div>
            </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedStories;
