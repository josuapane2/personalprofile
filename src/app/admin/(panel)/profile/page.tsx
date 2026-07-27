"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AdminInput, AdminTextarea } from "@/components/admin/AdminFormField";
import {
  AdminLoading,
  AdminNotice,
  AdminPageHeader,
  AdminSaveButton,
  type AdminStatus,
} from "@/components/admin/AdminUi";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { seedProfile } from "@/lib/seed-data";
import type { Profile } from "@/lib/types";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(seedProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<AdminStatus>(null);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Perubahan tidak dapat disimpan." });
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.from("profile").select("*").limit(1).single();

      if (error) {
        setStatus({ type: "error", message: `Gagal memuat profile: ${error.message}` });
      } else if (data) {
        setProfile(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!profile.name.trim() || !profile.title.trim() || !profile.bio.trim()) {
      setStatus({ type: "error", message: "Name, title, dan bio wajib diisi." });
      return;
    }

    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Data tidak dapat disimpan." });
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profile")
      .upsert({ ...profile, updated_at: new Date().toISOString() });

    setSaving(false);
    setStatus(
      error
        ? { type: "error", message: `Gagal menyimpan profile: ${error.message}` }
        : { type: "success", message: "Profile berhasil disimpan dan langsung tampil di website." }
    );
  }

  function update(field: keyof Profile, value: string) {
    setStatus(null);
    setProfile((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <AdminPageHeader
        title="Profile"
        description="Kelola identitas, kontak, foto, dan tautan utama yang tampil pada portfolio."
        action={
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
          >
            <ExternalLink size={15} /> Preview website
          </a>
        }
      />

      {loading ? (
        <AdminLoading label="Loading profile..." />
      ) : (
        <form onSubmit={handleSave} className="max-w-4xl">
          <AdminNotice status={status} />

          <section className="glass-card mb-5 p-5 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold">Main information</h2>
            <p className="mb-5 text-sm text-muted">Informasi utama yang mengenalkan Anda kepada pengunjung.</p>
            <div className="grid gap-5 md:grid-cols-2">
              <AdminInput label="Name" id="name" value={profile.name} onChange={(e) => update("name", e.target.value)} required />
              <AdminInput label="Professional title" id="title" value={profile.title} onChange={(e) => update("title", e.target.value)} required />
            </div>
            <div className="mt-5">
              <AdminTextarea label="Bio" id="bio" rows={5} value={profile.bio} onChange={(e) => update("bio", e.target.value)} required hint="Bio ini tampil pada bagian Hero dan About Me di website publik." />
            </div>
          </section>

          <section className="glass-card mb-5 p-5 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold">Contact details</h2>
            <p className="mb-5 text-sm text-muted">Digunakan pada bagian Contact di website.</p>
            <div className="grid gap-5 md:grid-cols-2">
              <AdminInput label="Location" id="location" value={profile.location ?? ""} onChange={(e) => update("location", e.target.value)} placeholder="Jakarta, Indonesia" />
              <AdminInput label="Email" id="email" type="email" value={profile.email ?? ""} onChange={(e) => update("email", e.target.value)} />
              <AdminInput label="Phone" id="phone" value={profile.phone ?? ""} onChange={(e) => update("phone", e.target.value)} placeholder="+62..." />
              <AdminInput label="Avatar URL" id="avatar" value={profile.avatar_url ?? ""} onChange={(e) => update("avatar_url", e.target.value)} hint="Gunakan path public seperti /assets/profile.jpg atau URL gambar penuh." />
            </div>
          </section>

          <section className="glass-card mb-6 p-5 sm:p-6">
            <h2 className="mb-1 text-lg font-semibold">Links and documents</h2>
            <p className="mb-5 text-sm text-muted">Tautan sosial dan dokumen yang dapat dibuka pengunjung.</p>
            <div className="grid gap-5 md:grid-cols-2">
              <AdminInput label="LinkedIn URL" id="linkedin" type="url" value={profile.linkedin_url ?? ""} onChange={(e) => update("linkedin_url", e.target.value)} />
              <AdminInput label="GitHub URL" id="github" type="url" value={profile.github_url ?? ""} onChange={(e) => update("github_url", e.target.value)} />
              <AdminInput label="CV URL" id="cv" value={profile.cv_url ?? ""} onChange={(e) => update("cv_url", e.target.value)} hint="Gunakan path file public atau URL dokumen penuh." />
            </div>
          </section>

          <div className="sticky bottom-4 flex justify-end rounded-xl border border-card-border bg-card/95 p-3 shadow-lg backdrop-blur">
            <AdminSaveButton saving={saving} label="Save profile" />
          </div>
        </form>
      )}
    </div>
  );
}
