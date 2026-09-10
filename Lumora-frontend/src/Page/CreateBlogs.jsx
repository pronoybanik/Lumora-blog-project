import React from "react";
import {
  ArrowLeft,
  Eye,
  Settings,
  ChevronDown,
  ImagePlus,
  X,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dvcbclqid";

const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "Lumora";

export default function CreateBlogs() {
  const [title, setTitle] = React.useState("The architecture of silence.");

  const [subtitle, setSubtitle] = React.useState("");

  const [content, setContent] = React.useState(
    `Every great design begins with an even better story. Begin yours here...

The Foundation

Minimalism isn't about removing things until there is nothing left. It's about removing the unnecessary so that the necessary may speak.`,
  );

  const [coverImage, setCoverImage] = React.useState("");

  const [imagePreview, setImagePreview] = React.useState("");

  const [uploadingImage, setUploadingImage] = React.useState(false);

  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  const [publishing, setPublishing] = React.useState(false);

  const [message, setMessage] = React.useState(null);

  const fileInputRef = React.useRef(null);

  const handleTitleChange = (e) => {
    const value = e.target.value;

    setTitle(value);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Please select a valid image file.",
      });

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Image size must be less than 5MB.",
      });

      return;
    }

    const localPreview = URL.createObjectURL(file);

    setImagePreview(localPreview);

    setUploadingImage(true);
    setMessage(null);

    try {
      if (!CLOUDINARY_CLOUD_NAME) {
        throw new Error("Cloudinary cloud name is missing.");
      }

      if (!CLOUDINARY_UPLOAD_PRESET) {
        throw new Error("Cloudinary upload preset is missing.");
      }

      const formData = new FormData();

      formData.append("file", file);

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      formData.append("folder", "lumora/blogs");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error?.message || "Cloudinary image upload failed.",
        );
      }

      setCoverImage(result.secure_url);

      setMessage({
        type: "success",
        text: "Featured image uploaded successfully.",
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      setCoverImage("");

      setMessage({
        type: "error",
        text: error?.message || "Failed to upload image.",
      });
    } finally {
      setUploadingImage(false);

      /*
      | Reset input so same image can be selected again
      */

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handlePublish = async () => {
    setMessage(null);

    if (!title.trim()) {
      setMessage({
        type: "error",
        text: "Blog title is required.",
      });

      return;
    }

    if (!content.trim()) {
      setMessage({
        type: "error",
        text: "Blog content is required.",
      });

      return;
    }

    if (!coverImage) {
      setMessage({
        type: "error",
        text: "Please upload a featured image.",
      });

      return;
    }

    if (!API_BASE_URL) {
      setMessage({
        type: "error",
        text: "VITE_API_BASE_URL is not configured.",
      });

      return;
    }

    setPublishing(true);

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),

        coverImage,
      };

      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`,
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || result?.error || "Failed to publish blog.",
        );
      }

      setMessage({
        type: "success",
        text: result?.message || "Blog published successfully.",
      });

      console.log("Created blog:", result);
    } catch (error) {
      console.error("Create blog error:", error);

      setMessage({
        type: "error",
        text:
          error?.message || "Something went wrong while publishing the blog.",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#f4f4fb] text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-[#f7f7fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Left */}

          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 shrink-0 transition-colors"
            >
              <ArrowLeft size={16} />

              <span className="hidden sm:inline">Back to posts</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />

              <span className="truncate">
                {publishing ? "Publishing..." : "Draft ready"}
              </span>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
            >
              <Eye size={16} />
              Preview
            </button>

            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
            >
              <Settings size={16} />
              Settings
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing || uploadingImage}
              className="flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-medium pl-4 pr-3 py-2 rounded-full transition-colors"
            >
              {publishing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  Publish
                  <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={17} />
            ) : (
              <AlertCircle size={17} />
            )}

            <span>{message.text}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-10">
        <section className="lg:col-span-3">
          <textarea
            rows={2}
            value={title}
            onChange={handleTitleChange}
            placeholder="The architecture of silence."
            className="w-full resize-none bg-transparent text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none leading-tight mb-4"
          />

          {/* Subtitle */}

          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Add a subtitle (optional)..."
            className="w-full bg-transparent text-lg sm:text-xl text-slate-700 placeholder:text-slate-300 focus:outline-none mb-8"
          />

          {/* Content editor */}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your story..."
            className="w-full min-h-[500px] resize-none bg-transparent text-base sm:text-lg text-slate-700 leading-8 focus:outline-none"
          />
        </section>

        {/* ================================================================
            SIDEBAR
        ================================================================= */}

        <aside className="lg:col-span-1">
          <p className="text-xs font-semibold tracking-wide text-indigo-700 mb-4">
            Post settings
          </p>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-6">

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Featured image
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Blog cover preview"
                    className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setCoverImage("");
                    }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                    aria-label="Remove image"
                  >
                    <X size={15} />
                  </button>

                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm text-slate-700">
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[4/3] rounded-xl bg-indigo-50 border border-dashed border-indigo-200 flex flex-col items-center justify-center gap-2 text-indigo-400 hover:bg-indigo-100/60 transition-colors"
                >
                  <ImagePlus size={22} />

                  <span className="text-xs font-medium">
                    Upload or drag image
                  </span>
                </button>
              )}

              {coverImage && !uploadingImage && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2">
                  <CheckCircle2 size={13} />
                  Image uploaded
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setAdvancedOpen((previous) => !previous)}
              className="flex items-center justify-between text-xs font-semibold text-indigo-700"
            >
              Advanced settings
              <ChevronRight
                size={14}
                className={`transition-transform ${
                  advancedOpen ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
