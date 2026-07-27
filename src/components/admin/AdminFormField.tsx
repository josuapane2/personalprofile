export function AdminInput({
  label,
  id,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {props.required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        id={id}
        className="w-full rounded-lg border border-card-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/10 disabled:cursor-not-allowed disabled:bg-bg-secondary"
        {...props}
      />
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function AdminTextarea({
  label,
  id,
  hint,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {props.required && <span className="ml-1 text-accent">*</span>}
      </label>
      <textarea
        id={id}
        className="w-full resize-y rounded-lg border border-card-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/10 disabled:cursor-not-allowed disabled:bg-bg-secondary"
        {...props}
      />
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function AdminSelect({
  label,
  id,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-lg border border-card-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/10"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
