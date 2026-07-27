"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminInput, AdminSelect, AdminTextarea } from "@/components/admin/AdminFormField";
import {
  AdminEmptyState,
  AdminLoading,
  AdminNotice,
  AdminPageHeader,
  AdminSaveButton,
  type AdminStatus,
} from "@/components/admin/AdminUi";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { seedExperiences } from "@/lib/seed-data";
import type { Experience, ExperienceCategory } from "@/lib/types";

const emptyExperience: Omit<Experience, "id"> = {
  category: "work",
  title: "",
  organization: "",
  location: "",
  period_start: "",
  period_end: "",
  description: "",
  highlights: [],
  sort_order: 0,
};

const categoryLabels: Record<ExperienceCategory, string> = {
  work: "Work",
  education: "Education",
  leadership: "Leadership",
  certification: "Certification",
  publication: "Publication",
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [highlightsText, setHighlightsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<AdminStatus>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setItems(seedExperiences);
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Data yang tampil hanya data demo." });
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.from("experiences").select("*").order("sort_order");
    setItems(data ?? []);
    if (error) setStatus({ type: "error", message: `Gagal memuat experience: ${error.message}` });
    setLoading(false);
  }

  function startEdit(item?: Experience) {
    setStatus(null);
    setEditing(item ? { ...item } : { ...emptyExperience, sort_order: items.length + 1 });
    setHighlightsText(item?.highlights.join("\n") ?? "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setStatus(null);

    if (!editing.title?.trim() || !editing.organization?.trim()) {
      setStatus({ type: "error", message: "Title dan organization wajib diisi." });
      return;
    }
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Experience tidak dapat disimpan." });
      return;
    }

    const payload = {
      category: editing.category ?? "work",
      title: editing.title.trim(),
      organization: editing.organization.trim(),
      location: editing.location?.trim() || null,
      period_start: editing.period_start?.trim() || null,
      period_end: editing.period_end?.trim() || null,
      description: editing.description?.trim() || null,
      highlights: highlightsText.split("\n").map((item) => item.trim()).filter(Boolean),
      sort_order: editing.sort_order ?? 0,
    };

    setSaving(true);
    const supabase = createClient();
    const query = editing.id && !editing.id.startsWith("exp-")
      ? supabase.from("experiences").update(payload).eq("id", editing.id)
      : supabase.from("experiences").insert(payload);
    const { error } = await query;
    setSaving(false);

    if (error) {
      setStatus({ type: "error", message: `Gagal menyimpan experience: ${error.message}` });
      return;
    }
    setEditing(null);
    setStatus({ type: "success", message: "Experience berhasil disimpan." });
    await loadData();
  }

  async function handleDelete(item: Experience) {
    if (!confirm(`Hapus "${item.title}" dari experience? Tindakan ini tidak dapat dibatalkan.`)) return;
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Experience tidak dapat dihapus." });
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("experiences").delete().eq("id", item.id);
    if (error) {
      setStatus({ type: "error", message: `Gagal menghapus experience: ${error.message}` });
      return;
    }
    setStatus({ type: "success", message: `"${item.title}" berhasil dihapus.` });
    await loadData();
  }

  return (
    <div>
      <AdminPageHeader
        title="Experience"
        description="Kelola pengalaman kerja, pendidikan, organisasi, sertifikasi, dan publikasi."
        action={<button type="button" onClick={() => startEdit()} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"><Plus size={16} /> Add experience</button>}
      />
      <AdminNotice status={status} />

      {editing && (
        <form onSubmit={handleSave} className="glass-card mb-8 p-5 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-card-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">{editing.id ? "Edit experience" : "Add experience"}</h2>
              <p className="mt-1 text-sm text-muted">Pilih kategori yang tepat agar tampil pada bagian yang sesuai.</p>
            </div>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close form" className="rounded-lg p-2 text-muted hover:bg-bg-secondary hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminSelect label="Category" id="experience-category" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as ExperienceCategory })}>
              {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </AdminSelect>
            <AdminInput label="Sort order" id="experience-sort" type="number" min="0" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} hint="Angka lebih kecil tampil lebih dulu pada kategorinya." />
            <AdminInput label="Title" id="experience-title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            <AdminInput label="Organization" id="experience-org" value={editing.organization ?? ""} onChange={(e) => setEditing({ ...editing, organization: e.target.value })} required />
            <AdminInput label="Location" id="experience-location" value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <AdminInput label="Start" id="experience-start" value={editing.period_start ?? ""} onChange={(e) => setEditing({ ...editing, period_start: e.target.value })} placeholder="October 2025" />
              <AdminInput label="End" id="experience-end" value={editing.period_end ?? ""} onChange={(e) => setEditing({ ...editing, period_end: e.target.value })} placeholder="Present" />
            </div>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <AdminTextarea label="Description" id="experience-description" rows={5} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            <AdminTextarea label="Highlights" id="experience-highlights" rows={5} value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} hint="Tulis satu pencapaian atau tugas per baris." />
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-card-border pt-5">
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-card-border px-4 py-2.5 text-sm font-semibold hover:bg-bg-secondary">Cancel</button>
            <AdminSaveButton saving={saving} label="Save experience" />
          </div>
        </form>
      )}

      {loading ? <AdminLoading label="Loading experience..." /> : items.length === 0 ? (
        <AdminEmptyState title="Belum ada experience" description="Tambahkan pengalaman pertama untuk mengisi career timeline." />
      ) : (
        <div>
          <p className="mb-3 text-sm text-muted">{items.length} entries</p>
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">{categoryLabels[item.category]}</span>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.organization}{item.period_start && ` · ${item.period_start}${item.period_end ? ` - ${item.period_end}` : ""}`}</p>
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
