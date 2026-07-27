import { AlertCircle, CheckCircle2, Inbox, LoaderCircle } from "lucide-react";

export type AdminStatus = {
  type: "success" | "error";
  message: string;
} | null;

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-card-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1 font-mono-label text-[0.65rem] uppercase tracking-[0.18em] text-accent">
          Portfolio Admin
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AdminNotice({ status }: { status: AdminStatus }) {
  if (!status) return null;

  const success = status.type === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      className={`mb-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
        success
          ? "border-emerald-600/20 bg-emerald-50 text-emerald-800"
          : "border-red-600/20 bg-red-50 text-red-700"
      }`}
    >
      <Icon size={17} className="mt-0.5 shrink-0" />
      <span>{status.message}</span>
    </div>
  );
}

export function AdminLoading({ label = "Loading data..." }: { label?: string }) {
  return (
    <div className="glass-card flex items-center justify-center gap-2 p-10 text-sm text-muted">
      <LoaderCircle size={18} className="animate-spin text-accent" />
      {label}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass-card flex flex-col items-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Inbox size={22} />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function AdminSaveButton({
  saving,
  label = "Save changes",
}: {
  saving: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving && <LoaderCircle size={16} className="animate-spin" />}
      {saving ? "Saving..." : label}
    </button>
  );
}
