"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { AdminInput } from "@/components/admin/AdminFormField";
import {
  AdminEmptyState,
  AdminLoading,
  AdminNotice,
  AdminPageHeader,
  type AdminStatus,
} from "@/components/admin/AdminUi";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { seedSkillGroups } from "@/lib/seed-data";
import type { SkillGroup } from "@/lib/types";

export default function AdminSkillsPage() {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newSkillNames, setNewSkillNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<AdminStatus>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setGroups(seedSkillGroups);
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Data yang tampil hanya data demo." });
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const [{ data: groupData, error: groupError }, { data: skillData, error: skillError }] = await Promise.all([
      supabase.from("skill_groups").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
    ]);

    if (groupError || skillError) {
      setStatus({ type: "error", message: `Gagal memuat skills: ${groupError?.message ?? skillError?.message}` });
    } else {
      setGroups((groupData ?? []).map((group) => ({
        ...group,
        skills: (skillData ?? []).filter((skill) => skill.group_id === group.id),
      })));
    }
    setLoading(false);
  }

  async function addGroup(e: React.FormEvent) {
    e.preventDefault();
    const name = newGroupName.trim();
    if (!name || busy) return;
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Group tidak dapat ditambahkan." });
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("skill_groups").insert({ name, icon: "code", sort_order: groups.length + 1 });
    setBusy(false);
    if (error) {
      setStatus({ type: "error", message: `Gagal menambah group: ${error.message}` });
      return;
    }
    setNewGroupName("");
    setStatus({ type: "success", message: `Group "${name}" berhasil ditambahkan.` });
    await loadData();
  }

  async function addSkill(group: SkillGroup) {
    const name = newSkillNames[group.id]?.trim();
    if (!name || busy) return;
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Skill tidak dapat ditambahkan." });
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("skills").insert({ group_id: group.id, name, sort_order: group.skills.length + 1 });
    setBusy(false);
    if (error) {
      setStatus({ type: "error", message: `Gagal menambah skill: ${error.message}` });
      return;
    }
    setNewSkillNames((prev) => ({ ...prev, [group.id]: "" }));
    setStatus({ type: "success", message: `Skill "${name}" berhasil ditambahkan.` });
    await loadData();
  }

  async function deleteGroup(group: SkillGroup) {
    if (!confirm(`Hapus group "${group.name}" beserta ${group.skills.length} skill di dalamnya?`)) return;
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Group tidak dapat dihapus." });
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("skill_groups").delete().eq("id", group.id);
    if (error) {
      setStatus({ type: "error", message: `Gagal menghapus group: ${error.message}` });
      return;
    }
    setStatus({ type: "success", message: `Group "${group.name}" berhasil dihapus.` });
    await loadData();
  }

  async function deleteSkill(group: SkillGroup, skillId: string, skillName: string) {
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Skill tidak dapat dihapus." });
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("skills").delete().eq("id", skillId);
    if (error) {
      setStatus({ type: "error", message: `Gagal menghapus skill: ${error.message}` });
      return;
    }
    setGroups((prev) => prev.map((item) => item.id === group.id ? { ...item, skills: item.skills.filter((skill) => skill.id !== skillId) } : item));
    setStatus({ type: "success", message: `Skill "${skillName}" berhasil dihapus.` });
  }

  return (
    <div>
      <AdminPageHeader title="Skills" description="Kelompokkan tools dan keahlian agar mudah dibaca pada bagian About Me." />
      <AdminNotice status={status} />

      <form onSubmit={addGroup} className="glass-card mb-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <AdminInput label="New skill group" id="new-group" placeholder="Contoh: Cloud & Deployment" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} hint="Group baru akan tampil setelah group yang sudah ada." />
        </div>
        <button type="submit" disabled={busy || !newGroupName.trim()} className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:opacity-50"><Plus size={16} /> Add group</button>
      </form>

      {loading ? <AdminLoading label="Loading skills..." /> : groups.length === 0 ? (
        <AdminEmptyState title="Belum ada skill group" description="Buat group pertama, lalu tambahkan skill di dalamnya." />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {groups.map((group) => (
            <section key={group.id} className="glass-card p-5">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-card-border pb-4">
                <div>
                  <h2 className="text-base font-semibold">{group.name}</h2>
                  <p className="mt-1 text-xs text-muted">{group.skills.length} skills</p>
                </div>
                <button type="button" onClick={() => deleteGroup(group)} aria-label={`Delete ${group.name}`} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>

              <div className="mb-5 flex min-h-12 flex-wrap content-start gap-2">
                {group.skills.length === 0 ? <p className="text-sm text-muted">Belum ada skill dalam group ini.</p> : group.skills.map((skill) => (
                  <span key={skill.id} className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-bg-secondary px-3 py-1.5 text-sm">
                    {skill.name}
                    <button type="button" onClick={() => deleteSkill(group, skill.id, skill.name)} aria-label={`Delete ${skill.name}`} className="text-muted hover:text-red-500"><X size={12} /></button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Tambah skill..."
                  value={newSkillNames[group.id] ?? ""}
                  onChange={(e) => setNewSkillNames((prev) => ({ ...prev, [group.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void addSkill(group);
                    }
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-card-border bg-card px-3.5 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
                />
                <button type="button" disabled={busy || !newSkillNames[group.id]?.trim()} onClick={() => addSkill(group)} className="rounded-lg border border-accent px-3 py-2 text-sm font-semibold text-accent hover:bg-accent/10 disabled:opacity-50">Add</button>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
