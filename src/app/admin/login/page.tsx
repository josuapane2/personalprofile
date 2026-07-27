"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, RefreshCcw } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);
    const type = params.get("type");
    const authError = searchParams.get("error_description") || params.get("error_description");

    const recovery = type === "recovery" || searchParams.get("mode") === "recovery";
    const enterRecoveryMode = () => {
      setIsRecoveryMode(true);
      setMessage("Buat password baru untuk akun admin kamu.");
    };

    const timer = window.setTimeout(() => {
      if (recovery) enterRecoveryMode();
      if (authError) setError(authError);
    }, 0);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") enterRecoveryMode();
    });

    return () => {
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
      );
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleSendRecovery() {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Masukkan email admin dulu.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/admin/login`,
      }
    );

    if (recoveryError) {
      setError(recoveryError.message);
      setLoading(false);
      return;
    }

    setMessage("Email reset password sudah dikirim. Buka link terbaru dari email itu.");
    setLoading(false);
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword.trim()) {
      setError("Masukkan password baru.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase belum dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
      );
      return;
    }

    setRecoveryLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setRecoveryLoading(false);
      return;
    }

    setMessage("Password berhasil diganti. Silakan login ulang.");
    setNewPassword("");
    window.location.hash = "";
    setIsRecoveryMode(false);
    await supabase.auth.signOut();
    setRecoveryLoading(false);
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold">Portfolio Admin</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage your portfolio content.
          </p>
        </div>

        <form
          onSubmit={isRecoveryMode ? handleUpdatePassword : handleSubmit}
          className="glass-card rounded-2xl p-8"
        >
          {isRecoveryMode && (
            <div className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              Recovery mode aktif. Masukkan password baru untuk akun ini.
            </div>
          )}

          {!isRecoveryMode && (
            <div className="mb-5">
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-card-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-accent"
                  placeholder="admin@email.com"
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              {isRecoveryMode ? "New password" : "Password"}
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                id="password"
                type="password"
                required
                value={isRecoveryMode ? newPassword : password}
                onChange={(e) =>
                  isRecoveryMode
                    ? setNewPassword(e.target.value)
                    : setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-card-border bg-background py-3 pl-10 pr-4 text-sm outline-none focus:border-accent"
                placeholder={isRecoveryMode ? "Password baru" : "••••••••"}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              <RefreshCcw size={16} className="mt-0.5 shrink-0" />
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || recoveryLoading}
            className="w-full rounded-xl bg-gradient-to-r from-accent to-accent-secondary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isRecoveryMode
              ? recoveryLoading
                ? "Saving password..."
                : "Save new password"
              : loading
                ? "Signing in..."
                : "Sign In"}
          </button>

          {!isRecoveryMode && (
            <button
              type="button"
              onClick={handleSendRecovery}
              disabled={loading}
              className="mt-3 w-full text-sm font-medium text-accent transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              Lupa password? Kirim link reset ke email
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
