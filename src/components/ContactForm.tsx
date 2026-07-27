"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ContactForm({ email }: { email: string | null }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    if (!isSupabaseConfigured()) {
      if (!email) {
        setStatus("error");
        return;
      }
      const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\nReply to: ${form.email}`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      subject: null,
      message: form.message,
    });

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="editorial-card p-8">
      <div className="mb-5">
        <label htmlFor="name" className="mb-2 block text-[0.85rem] font-medium">
          Name
        </label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
          placeholder="Your name"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="mb-2 block text-[0.85rem] font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
          placeholder="your@email.com"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="mb-2 block text-[0.85rem] font-medium">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full resize-none rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
          placeholder="Your message..."
        />
      </div>

      {status === "success" && (
        <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--secondary-light)] px-4 py-3 text-sm text-[var(--secondary)]">
          <CheckCircle size={16} />
          Your email app has been opened with the message ready to send.
        </div>
      )}

      {status === "error" && (
        <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} />
          Failed to send message. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn btn-primary disabled:opacity-50"
      >
        <Send size={16} />
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
