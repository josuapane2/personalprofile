"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminFormField";
import {
  AdminEmptyState,
  AdminLoading,
  AdminNotice,
  AdminPageHeader,
  AdminSaveButton,
  type AdminStatus,
} from "@/components/admin/AdminUi";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { seedProjects } from "@/lib/seed-data";
import type { Project } from "@/lib/types";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  subtitle: "",
  description: "",
  tags: [],
  year: "",
  project_url: "",
  doc_url: "",
  image_url: "",
  featured: false,
  sort_order: 0,
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<AdminStatus>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setItems(seedProjects);
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Data yang tampil hanya data demo." });
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.from("projects").select("*").order("sort_order");
    setItems(data ?? []);
    if (error) setStatus({ type: "error", message: `Gagal memuat projects: ${error.message}` });
    setLoading(false);
  }

  function startEdit(item?: Project) {
    setStatus(null);
    setEditing(item ? { ...item } : { ...emptyProject, sort_order: items.length + 1 });
    setTagsText(item?.tags.join(", ") ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setStatus(null);

    if (!editing.title?.trim() || !editing.description?.trim()) {
      setStatus({ type: "error", message: "Title dan description wajib diisi." });
      return;
    }
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Project tidak dapat disimpan." });
      return;
    }

    const payload = {
      title: editing.title.trim(),
      subtitle: editing.subtitle?.trim() || null,
      description: editing.description.trim(),
      tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
      year: editing.year?.trim() || null,
      project_url: editing.project_url?.trim() || null,
      doc_url: editing.doc_url?.trim() || null,
      image_url: editing.image_url?.trim() || null,
      featured: editing.featured ?? false,
      sort_order: editing.sort_order ?? 0,
    };

    setSaving(true);
    const supabase = createClient();
    const query = editing.id && !editing.id.startsWith("proj-")
      ? supabase.from("projects").update(payload).eq("id", editing.id)
      : supabase.from("projects").insert(payload);
    const { error } = await query;
    setSaving(false);

    if (error) {
      setStatus({ type: "error", message: `Gagal menyimpan project: ${error.message}` });
      return;
    }
    setEditing(null);
    setStatus({ type: "success", message: "Project berhasil disimpan." });
    await loadData();
  }

  async function handleDelete(item: Project) {
    if (!confirm(`Hapus project "${item.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Project tidak dapat dihapus." });
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", item.id);
    if (error) {
      setStatus({ type: "error", message: `Gagal menghapus project: ${error.message}` });
      return;
    }
    setStatus({ type: "success", message: `"${item.title}" berhasil dihapus.` });
    await loadData();
  }

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Tambah dan susun project yang tampil pada bagian portfolio."
        action={<button type="button" onClick={() => startEdit()} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"><Plus size={16} /> Add project</button>}
      />
      <AdminNotice status={status} />

      {editing && (
        <form onSubmit={handleSave} className="glass-card mb-8 p-5 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-card-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">{editing.id ? "Edit project" : "Add project"}</h2>
              <p className="mt-1 text-sm text-muted">Title dan description wajib diisi.</p>
            </div>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close form" className="rounded-lg p-2 text-muted hover:bg-bg-secondary hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput label="Title" id="project-title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            <AdminInput label="Subtitle" id="project-subtitle" value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
            <AdminInput label="Year" id="project-year" value={editing.year ?? ""} onChange={(e) => setEditing({ ...editing, year: e.target.value })} placeholder="2026" />
            <AdminInput label="Sort order" id="project-sort" type="number" min="0" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} hint="Angka lebih kecil tampil lebih dulu." />
            <AdminInput label="Project URL" id="project-url" type="url" value={editing.project_url ?? ""} onChange={(e) => setEditing({ ...editing, project_url: e.target.value })} />
            <AdminInput label="Documentation URL" id="project-doc" value={editing.doc_url ?? ""} onChange={(e) => setEditing({ ...editing, doc_url: e.target.value })} />
            <AdminInput label="Image URL" id="project-image" value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
            <AdminInput label="Tags" id="project-tags" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Power BI, Python, SQL" hint="Pisahkan setiap tag menggunakan koma." />
          </div>
          <div className="mt-5">
            <AdminTextarea label="Description" id="project-description" rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required />
          </div>
          <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 rounded-lg border border-card-border px-3 py-2 text-sm">
            <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
            Show as featured project
          </label>
          <div className="mt-6 flex justify-end gap-3 border-t border-card-border pt-5">
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-card-border px-4 py-2.5 text-sm font-semibold hover:bg-bg-secondary">Cancel</button>
            <AdminSaveButton saving={saving} label="Save project" />
          </div>
        </form>
      )}

      {loading ? <AdminLoading label="Loading projects..." /> : items.length === 0 ? (
        <AdminEmptyState title="Belum ada project" description="Tambahkan project pertama untuk mulai menampilkan portfolio." action={<button type="button" onClick={() => startEdit()} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">Add project</button>} />
      ) : (
        <div>
          <p className="mb-3 text-sm text-muted">{items.length} projects</p>
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold">{item.title}</h3>
                    {item.featured && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700"><Star size={11} fill="currentColor" /> Featured</span>}
                    {item.year && <span className="text-xs text-muted">{item.year}</span>}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">{item.description}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-2 rounded-lg border border-card-border px-3 py-2 text-sm font-semibold hover:border-accent hover:text-accent"><Pencil size={14} /> Edit</button>
                  <button type="button" onClick={() => handleDelete(item)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 size={14} /> Delete</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
