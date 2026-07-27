import type { Profile } from "@/lib/types";

export default function DataProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="editorial-card mx-auto w-full max-w-[340px] overflow-hidden font-mono-label text-[0.75rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(200,92,64,0.08)]">
      <div className="border-b border-[var(--border-light)] bg-[var(--bg-secondary)] px-5 py-8">
        <p className="font-display text-2xl font-bold leading-tight">Turning retail data into decisions.</p>
        <p className="mt-3 font-[family-name:var(--font-body)] text-[0.82rem] leading-relaxed text-[var(--text-secondary)]">
          Sales analytics, dashboard development, data quality, and reporting automation.
        </p>
      </div>

      <div className="px-4 py-3">
        <p className="mb-2 font-display text-sm font-semibold text-[var(--text)]">
          {profile.name}
        </p>
        {[
          { label: "LOCATION", value: profile.location ?? "Jakarta, ID" },
          { label: "ROLE", value: profile.title },
          { label: "EDUCATION", value: "Telkom University" },
          { label: "GPA", value: "3.58/4.00" },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between border-b border-[var(--border-light)] py-1.5 last:border-0"
          >
            <span className="text-[0.6rem] tracking-wider text-[var(--text-muted)]">
              {row.label}
            </span>
            <span className="font-[family-name:var(--font-body)] text-[0.8rem] font-medium text-[var(--text)]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
