

import React, { useEffect, useMemo, useState } from "react";
import {
  Link2,
  Mail,
  MessageCircle,
  BadgeCheck,
  FileText,
  Eye,
  Award,
  LayoutGrid,
  List,
  Heart,
  MessageSquare,
  Compass,
  MapPin,
  BriefcaseBusiness,
  Globe,
  Edit3,
  X,
  Save,
  Loader2,
  ExternalLink,
  CalendarDays,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/v1";

/* =========================================================
   Types
========================================================= */

const EMPTY_PROFILE = {
  bio: "",
  avatar: "",
  coverImage: "",
  username: "",
  location: "",
  website: "",
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  github: "",
  profession: "",
  expertise: "",
};

/* =========================================================
   Helper Functions
========================================================= */

const getToken = () => {
  if (typeof window === "undefined") return null;

  // Change this if your project uses another localStorage key.
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

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getReadTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  if (!words) return "1 min read";

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const getBlogDescription = (blog) => {
  if (blog.excerpt) return blog.excerpt;

  if (!blog.content) return "No description available.";

  const cleanContent = blog.content.replace(/\s+/g, " ").trim();

  return cleanContent.length > 180
    ? `${cleanContent.substring(0, 180)}...`
    : cleanContent;
};

const getStatusStyle = (status) => {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-600/80";

    case "DRAFT":
      return "bg-slate-700/80";

    case "ARCHIVED":
      return "bg-orange-600/80";

    default:
      return "bg-black/50";
  }
};

/* =========================================================
   Blog Card
========================================================= */

function PublicationCard({ blog, viewMode }) {
  const description = getBlogDescription(blog);
  const readTime = getReadTime(blog.content);

  return (
    <article
      className={
        viewMode === "grid"
          ? "bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          : "bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col sm:flex-row gap-4"
      }
    >
      {/* Image */}
      <div
        className={
          viewMode === "grid"
            ? "relative w-full h-48 overflow-hidden bg-slate-100"
            : "relative w-full sm:w-40 h-36 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-slate-100"
        }
      >
        <span
          className={`absolute top-2 left-2 ${getStatusStyle(
            blog.status
          )} text-white text-[10px] font-medium tracking-wide px-2 py-1 rounded z-10`}
        >
          {blog.status || "BLOG"}
        </span>

        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            className="w-full h-full object-cover"
            alt={blog.title || "Blog cover"}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-700">
            <Compass
              className="w-10 h-10 text-white/90"
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={
          viewMode === "grid" ? "p-4" : "flex-1"
        }
      >
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>{formatDate(blog.createdAt)}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>

        <h4 className="text-slate-900 font-semibold mb-1.5 line-clamp-2">
          {blog.title}
        </h4>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" strokeWidth={2} />
            {blog.viewCount ?? 0}
          </span>

          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" strokeWidth={2} />
            0
          </span>

          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
            0
          </span>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   Social Link
========================================================= */

function SocialLink({ href, icon: Icon, label }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
    </a>
  );
}

/* =========================================================
   Edit Profile Modal
========================================================= */

function EditProfileModal({
  profile,
  onClose,
  onSave,
  saving,
}) {
  const [formData, setFormData] = useState({
    ...EMPTY_PROFILE,
    ...profile,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSave(formData);
  };

  const fields = [
    {
      name: "username",
      label: "Username",
      placeholder: "john_doe",
    },
    {
      name: "bio",
      label: "Bio",
      placeholder: "Tell something about yourself...",
      textarea: true,
    },
    {
      name: "avatar",
      label: "Avatar URL",
      placeholder: "https://example.com/avatar.jpg",
    },
    {
      name: "coverImage",
      label: "Cover Image URL",
      placeholder: "https://example.com/cover.jpg",
    },
    {
      name: "location",
      label: "Location",
      placeholder: "Dhaka, Bangladesh",
    },
    {
      name: "website",
      label: "Website",
      placeholder: "https://example.com",
    },
    {
      name: "profession",
      label: "Profession",
      placeholder: "Software Engineer",
    },
    {
      name: "expertise",
      label: "Expertise",
      placeholder: "React, Next.js, Node.js",
      textarea: true,
    },
    {
      name: "facebook",
      label: "Facebook",
      placeholder: "https://facebook.com/username",
    },
    {
      name: "instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/username",
    },
    {
      name: "twitter",
      label: "Twitter",
      placeholder: "https://twitter.com/username",
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      placeholder: "https://linkedin.com/in/username",
    },
    {
      name: "github",
      label: "GitHub",
      placeholder: "https://github.com/username",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edit Profile
            </h2>

            <p className="text-sm text-slate-500 mt-0.5">
              Update your profile information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-130px)]"
        >
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((field) => (
              <div
                key={field.name}
                className={
                  field.textarea
                    ? "md:col-span-2"
                    : ""
                }
              >
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {field.label}
                </label>

                {field.textarea ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={field.name === "bio" ? 4 : 3}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 placeholder:text-slate-400 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 placeholder:text-slate-400"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   Main Profile Page
========================================================= */

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(EMPTY_PROFILE);

  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);

  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [viewMode, setViewMode] = useState("list");

  /* =======================================================
     Fetch Current User
  ======================================================= */

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/user/me`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch profile"
        );
      }

      const currentUser = result.data;

      setUser(currentUser);

      setProfile({
        ...EMPTY_PROFILE,
        ...(currentUser.profile || {}),
      });
    } catch (err) {
      console.error("Profile fetch error:", err);

      setError(
        err.message || "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     Fetch My Blogs
  ======================================================= */

  const fetchMyBlogs = async () => {
    try {
      setBlogLoading(true);

      const response = await fetch(`${API_BASE_URL}/blog/my`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch blogs"
        );
      }

      setBlogs(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Blog fetch error:", err);

      setBlogs([]);
    } finally {
      setBlogLoading(false);
    }
  };

  /* =======================================================
     Initial API Calls
  ======================================================= */

  useEffect(() => {
    fetchMyProfile();
    fetchMyBlogs();
  }, []);

  /* =======================================================
     Update Profile
  ======================================================= */

  const handleUpdateProfile = async (formData) => {
    try {
      setSavingProfile(true);

      const response = await fetch(
        `${API_BASE_URL}/user/profile`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({
            bio: formData.bio || null,
            avatar: formData.avatar || null,
            coverImage: formData.coverImage || null,
            username: formData.username || null,
            location: formData.location || null,
            website: formData.website || null,
            facebook: formData.facebook || null,
            instagram: formData.instagram || null,
            twitter: formData.twitter || null,
            linkedin: formData.linkedin || null,
            github: formData.github || null,
            profession: formData.profession || null,
            expertise: formData.expertise || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Profile update failed"
        );
      }

      // API returns updated profile object
      const updatedProfile = result.data;

      setProfile({
        ...EMPTY_PROFILE,
        ...updatedProfile,
      });

      // Update user.profile too
      setUser((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          profile: updatedProfile,
        };
      });

      setEditOpen(false);
    } catch (err) {
      console.error("Profile update error:", err);

      alert(
        err.message || "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /* =======================================================
     Derived Blog Stats
  ======================================================= */

  const blogStats = useMemo(() => {
    const published = blogs.filter(
      (blog) => blog.status === "PUBLISHED"
    ).length;

    const totalViews = blogs.reduce(
      (total, blog) =>
        total + Number(blog.viewCount || 0),
      0
    );

    const drafts = blogs.filter(
      (blog) => blog.status === "DRAFT"
    ).length;

    return {
      total: blogs.length,
      published,
      drafts,
      totalViews,
    };
  }, [blogs]);

  /* =======================================================
     Loading State
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />

          <p className="text-sm">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     Error State
  ======================================================= */

  if (error && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-red-100 rounded-xl p-6 max-w-md text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load profile
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchMyProfile}
            className="mt-5 px-5 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  const displayName =
    user?.name || profile.username || "User";

  const profession =
    profile.profession || "Lumora User";

  const location =
    profile.location || "Location not added";

  const avatar =
    profile.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=4338ca&color=fff&size=256`;

  const coverImage = profile.coverImage;

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* ===================================================
          Hero / Cover
      =================================================== */}

      <div
        className="relative h-[300px] overflow-hidden"
        style={{
          background: coverImage
            ? undefined
            : "linear-gradient(120deg, #e9d9c9 0%, #dce7f0 35%, #e3d7ea 65%, #f0e2d6 100%)",
        }}
      >
        {coverImage && (
          <img
            src={coverImage}
            alt="Profile cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-white/20" />

        {!coverImage && (
          <svg
            className="absolute inset-0 w-full h-full opacity-60"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 C200,180 300,60 500,110 C700,160 800,40 1000,90 C1100,115 1150,130 1200,120 L1200,300 L0,300 Z"
              fill="#ffffff"
              fillOpacity="0.25"
            />

            <path
              d="M0,180 C250,120 350,220 600,170 C800,130 900,220 1200,160 L1200,300 L0,300 Z"
              fill="#ffffff"
              fillOpacity="0.3"
            />
          </svg>
        )}

        <div className="relative flex flex-col items-center pt-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            {displayName}
          </h1>

          <p className="text-sm text-slate-600 mt-1">
            {profession}
          </p>

          <p className="text-sm text-slate-600 flex items-center justify-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </p>

          <nav className="flex gap-8 mt-6 text-sm font-medium text-slate-500">
            <button className="text-slate-800 border-b-2 border-slate-800 pb-1">
              Overview
            </button>

            <button className="hover:text-slate-800">
              Publications
            </button>

            <button className="hover:text-slate-800">
              Activity
            </button>

            <button className="hover:text-slate-800">
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* ===================================================
          Main Container
      =================================================== */}

      <div className="max-w-6xl mx-auto px-6">
        {/* =================================================
            Profile Header
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 relative pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={avatar}
                alt={displayName}
                className="w-32 h-32 rounded-full ring-4 ring-white object-cover bg-slate-100"
              />

              <span className="absolute bottom-2 right-2 bg-blue-600 rounded-full p-1 ring-2 ring-white">
                <BadgeCheck
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={2.5}
                />
              </span>
            </div>

            {/* User Info */}
            <div className="pb-2 sm:pb-3">
              <h2 className="text-xl font-semibold text-slate-900">
                {displayName}
              </h2>

              <p className="text-slate-500 text-sm mt-1 max-w-md">
                {profile.bio ||
                  "Tell the world something about yourself."}
              </p>

              {/* Social Links */}
              <div className="flex gap-2 mt-3">
                {profile.website && (
                  <SocialLink
                    href={profile.website}
                    icon={Link2}
                    label="Website"
                  />
                )}

                <SocialLink
                  href={profile.github}
                  icon={Link2}
                  label="GitHub"
                />

                <SocialLink
                  href={profile.linkedin}
                  icon={Link2}
                  label="LinkedIn"
                />

                <SocialLink
                  href={profile.facebook}
                  icon={Link2}
                  label="Facebook"
                />

                <SocialLink
                  href={profile.instagram}
                  icon={Link2}
                  label="Instagram"
                />

                <SocialLink
                  href={profile.twitter}
                  icon={Link2}
                  label="Twitter"
                />

                {user?.email && (
                  <a
                    href={`mailto:${user.email}`}
                    title="Email"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  >
                    <Mail
                      className="w-4 h-4"
                      strokeWidth={2}
                    />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pb-3 mt-4 sm:mt-0">
            <button
              onClick={() => setEditOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-medium flex items-center gap-2 transition"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* =================================================
            Main Content
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 pb-16">
          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <div className="space-y-6">
            {/* Blog Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex divide-x divide-slate-100">
              <div className="flex-1 text-center py-4">
                <div className="text-lg font-semibold text-slate-900">
                  {blogStats.total}
                </div>

                <div className="text-xs text-slate-400 tracking-wide">
                  BLOGS
                </div>
              </div>

              <div className="flex-1 text-center py-4">
                <div className="text-lg font-semibold text-slate-900">
                  {blogStats.published}
                </div>

                <div className="text-xs text-slate-400 tracking-wide">
                  PUBLISHED
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500 mb-4">
                PROFILE INFORMATION
              </h3>

              <div className="space-y-4">
                {/* Profession */}
                <div className="flex items-start gap-3">
                  <BriefcaseBusiness className="w-4 h-4 text-slate-400 mt-0.5" />

                  <div>
                    <p className="text-xs text-slate-400">
                      Profession
                    </p>

                    <p className="text-sm text-slate-700 mt-0.5">
                      {profile.profession || "Not added"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />

                  <div>
                    <p className="text-xs text-slate-400">
                      Location
                    </p>

                    <p className="text-sm text-slate-700 mt-0.5">
                      {profile.location || "Not added"}
                    </p>
                  </div>
                </div>

                {/* Website */}
                {profile.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-slate-400 mt-0.5" />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">
                        Website
                      </p>

                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:underline mt-0.5 flex items-center gap-1 break-all"
                      >
                        {profile.website}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Expertise */}
                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-slate-400 mt-0.5" />

                  <div>
                    <p className="text-xs text-slate-400">
                      Expertise
                    </p>

                    <p className="text-sm text-slate-700 mt-0.5">
                      {profile.expertise || "Not added"}
                    </p>
                  </div>
                </div>

                {/* Joined */}
                {user?.createdAt && (
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-slate-400 mt-0.5" />

                    <div>
                      <p className="text-xs text-slate-400">
                        Joined
                      </p>

                      <p className="text-sm text-slate-700 mt-0.5">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-indigo-50/60 rounded-xl border border-indigo-100 p-5">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500 mb-4">
                BLOG OVERVIEW
              </h3>

              {/* Published */}
              <div className="flex items-center justify-between text-sm text-slate-700 mb-1.5">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Published Blogs
                </span>

                <span className="font-semibold text-slate-900">
                  {blogStats.published}
                </span>
              </div>

              <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${
                      blogStats.total
                        ? (blogStats.published /
                            blogStats.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              {/* Views */}
              <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-500" />
                  Total Views
                </span>

                <span className="font-semibold text-slate-900">
                  {blogStats.totalViews}
                </span>
              </div>

              {/* Drafts */}
              <div className="flex items-center justify-between text-sm text-slate-700 mt-4">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Drafts
                </span>

                <span className="font-semibold text-slate-900">
                  {blogStats.drafts}
                </span>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-xs font-semibold tracking-wide text-slate-500 mb-4">
                ACCOUNT
              </h3>

              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  {user?.role || "USER"}
                </span>

                {profile.username && (
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full">
                    @{profile.username}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE - BLOGS
          ================================================= */}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  My Publications
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Your latest blog posts
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    viewMode === "grid"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-white border border-slate-200 text-slate-500"
                  }`}
                >
                  <LayoutGrid
                    className="w-4 h-4"
                    strokeWidth={2}
                  />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    viewMode === "list"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-white border border-slate-200 text-slate-500"
                  }`}
                >
                  <List
                    className="w-4 h-4"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

            {/* Blog Loading */}
            {blogLoading && (
              <div className="bg-white rounded-xl border border-slate-100 p-10 flex flex-col items-center justify-center">
                <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />

                <p className="text-sm text-slate-500 mt-3">
                  Loading your blogs...
                </p>
              </div>
            )}

            {/* Empty Blogs */}
            {!blogLoading && blogs.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-100 p-10 text-center">
                <FileText className="w-10 h-10 mx-auto text-slate-300" />

                <h4 className="text-sm font-semibold text-slate-700 mt-4">
                  No blogs yet
                </h4>

                <p className="text-xs text-slate-400 mt-1">
                  Your created blogs will appear here.
                </p>
              </div>
            )}

            {/* Blog List */}
            {!blogLoading && blogs.length > 0 && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                    : "space-y-4"
                }
              >
                {blogs.map((blog) => (
                  <PublicationCard
                    key={blog.id}
                    blog={blog}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      {editOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => {
            if (!savingProfile) {
              setEditOpen(false);
            }
          }}
          onSave={handleUpdateProfile}
          saving={savingProfile}
        />
      )}
    </div>
  );
}


