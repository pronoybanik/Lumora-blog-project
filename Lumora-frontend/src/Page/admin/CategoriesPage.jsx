import { useEffect, useState } from "react";
import { Edit3, Loader2, Plus, Tag, Trash2, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem("accessToken");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: getToken() || "",
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/category`);
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to load categories.");
      setCategories(Array.isArray(result.data) ? result.data : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  const submitCategory = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        editingId
          ? `${API_BASE_URL}/category/${editingId}`
          : `${API_BASE_URL}/category`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: authHeaders(),
          body: JSON.stringify({ name: name.trim(), description: description.trim() }),
        },
      );
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to save category.");
      setSuccess(editingId ? "Category updated successfully." : "Category created successfully.");
      resetForm();
      await loadCategories();
    } catch (requestError) {
      setError(requestError.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const editCategory = (category) => {
    setEditingId(category.id);
    setName(category.name || "");
    setDescription(category.description || "");
    setError("");
    setSuccess("");
  };

  const removeCategory = async (category) => {
    if (!window.confirm(`Delete the ${category.name} category? Blogs will become uncategorized.`)) return;
    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/category/${category.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to delete category.");
      setSuccess("Category deleted successfully.");
      await loadCategories();
    } catch (requestError) {
      setError(requestError.message || "Unable to delete category.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight text-slate-900">Categories</h1>
            <p className="mt-1 text-sm text-slate-500">Organize Lumora blogs for easier discovery.</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </span>
        </div>

        {(error || success) && (
          <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-100 bg-red-50 text-red-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"}`}>
            {error || success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <form onSubmit={submitCategory} className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">{editingId ? "Edit category" : "Create category"}</h2>
              {editingId && <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-700"><X size={17} /></button>}
            </div>
            <label className="text-xs font-semibold text-slate-500">Name</label>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Technology" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
            <label className="mt-4 block text-xs font-semibold text-slate-500">Description <span className="font-normal text-slate-400">(optional)</span></label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="A short description..." className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
            <button disabled={saving} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {editingId ? "Save changes" : "Add category"}
            </button>
          </form>

          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-semibold text-slate-900">All categories</h2></div>
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><Loader2 size={17} className="animate-spin" /> Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center"><Tag className="text-slate-300" size={28} /><p className="mt-3 text-sm text-slate-500">No categories yet.</p></div>
            ) : (
              <div className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2"><span className="font-medium text-slate-900">{category.name}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{category._count?.blogs || 0} blogs</span></div>
                      <p className="mt-1 truncate text-xs text-slate-500">{category.description || "No description"}</p>
                      <p className="mt-1 text-[11px] text-slate-400">/{category.slug}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1"><button onClick={() => editCategory(category)} className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-700" aria-label={`Edit ${category.name}`}><Edit3 size={16} /></button><button onClick={() => removeCategory(category)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${category.name}`}><Trash2 size={16} /></button></div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
