"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, RefreshCw, Trash2 } from "lucide-react";
import {
  AdminEmptyState,
  AdminLoading,
  AdminNotice,
  AdminPageHeader,
  type AdminStatus,
} from "@/components/admin/AdminUi";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ContactMessage } from "@/lib/types";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<AdminStatus>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setStatus({ type: "error", message: "Supabase belum dikonfigurasi. Pesan tidak dapat dimuat." });
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data ?? []);
    if (error) setStatus({ type: "error", message: `Gagal memuat pesan: ${error.message}` });
    setLoading(false);
  }

  async function openMessage(message: ContactMessage) {
    setSelected(message);
    if (message.read) return;
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", message.id);
    if (error) {
      setStatus({ type: "error", message: `Gagal menandai pesan: ${error.message}` });
      return;
    }
    setMessages((prev) => prev.map((item) => item.id === message.id ? { ...item, read: true } : item));
  }

  async function handleDelete(message: ContactMessage) {
    if (!confirm(`Hapus pesan dari ${message.name}? Tindakan ini tidak dapat dibatalkan.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", message.id);
    if (error) {
      setStatus({ type: "error", message: `Gagal menghapus pesan: ${error.message}` });
      return;
    }
    setMessages((prev) => prev.filter((item) => item.id !== message.id));
    setSelected(null);
    setStatus({ type: "success", message: "Pesan berhasil dihapus." });
  }

  const unread = messages.filter((message) => !message.read).length;

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description={`${unread} unread messages from the website contact form.`}
        action={<button type="button" onClick={() => loadData()} className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"><RefreshCw size={15} /> Refresh</button>}
      />
      <AdminNotice status={status} />

      {loading ? <AdminLoading label="Loading messages..." /> : messages.length === 0 ? (
        <AdminEmptyState title="Belum ada pesan masuk" description="Pesan yang dikirim melalui contact form akan tampil di sini." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="space-y-2">
            {messages.map((message) => (
              <button key={message.id} type="button" onClick={() => openMessage(message)} className={`glass-card w-full p-4 text-left transition-colors hover:border-accent/40 ${selected?.id === message.id ? "border-accent bg-accent/5" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {message.read ? <MailOpen size={16} className="shrink-0 text-muted" /> : <Mail size={16} className="shrink-0 text-accent" />}
                    <span className={`truncate text-sm ${message.read ? "text-muted" : "font-semibold"}`}>{message.name}</span>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{new Date(message.created_at).toLocaleDateString("id-ID")}</span>
                </div>
                <p className="mt-2 truncate text-sm text-muted">{message.subject || message.message}</p>
              </button>
            ))}
          </div>

          {selected ? (
            <article className="glass-card h-fit p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4 border-b border-card-border pb-5">
                <div>
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                  <a href={`mailto:${selected.email}`} className="mt-1 block text-sm text-accent hover:underline">{selected.email}</a>
                </div>
                <button type="button" onClick={() => handleDelete(selected)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 size={14} /> Delete</button>
              </div>
              {selected.subject && <h3 className="mb-3 text-base font-semibold">{selected.subject}</h3>}
              <p className="whitespace-pre-wrap text-sm leading-7 text-text-secondary">{selected.message}</p>
              <p className="mt-6 border-t border-card-border pt-4 text-xs text-muted">{new Date(selected.created_at).toLocaleString("id-ID")}</p>
            </article>
          ) : (
            <AdminEmptyState title="Pilih pesan" description="Pilih salah satu pesan untuk membaca isinya." />
          )}
        </div>
      )}
    </div>
  );
}
