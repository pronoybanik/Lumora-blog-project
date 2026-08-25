

const featuredStories = [
  {
    tag: "Technology",
    title: "The Future of Spatial Computing and Design",
    excerpt:
      "Exploring how augmented realities will seamlessly blend into our daily workflows...",
    author: "Elena Rostova",
    read: "5 min read",
    img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=800&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/40?img=32",
  },
  {
    tag: "Architecture",
    title: "Minimalism Beyond the Aesthetic",
    excerpt:
      "Why removing the unnecessary is fundamentally a structural philosophy rath...",
    author: "David Chen",
    read: "8 min read",
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    tag: "Lifestyle",
    title: "Finding Silence in a Loud World",
    excerpt:
      "Strategies for cultivating internal peace amidst the constant stream of digital...",
    author: "Sarah Jenkins",
    read: "12 min read",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
    avatar: "https://i.pravatar.cc/40?img=45",
  },
];


const FeaturedStories = () => {
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
        <a
          href="#"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View all <span aria-hidden>&rarr;</span>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredStories.map((story) => (
          <article
            key={story.title}
            className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow"
          >
            <div className="relative h-44">
              <img
                src={story.img}
                alt={story.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-white/90 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                {story.tag}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-slate-900 leading-snug mb-2">
                {story.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                {story.excerpt}
              </p>
              <div className="flex items-center gap-2">
                <img
                  src={story.avatar}
                  alt={story.author}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs text-slate-600">{story.author}</span>
                <span className="text-xs text-slate-300">&middot;</span>
                <span className="text-xs text-slate-400">{story.read}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedStories;
