import type { Experience } from "@/lib/types";

export default function ExperienceTimeline({
  items,
}: {
  items: Experience[];
}) {
  return (
    <div className="relative ml-1 border-l-2 border-[var(--border)] pl-7">
      {items.map((exp) => {
        const period = [exp.period_start, exp.period_end]
          .filter(Boolean)
          .join(" — ");

        return (
          <div key={exp.id} className="relative pb-4 last:pb-0">
            <span
              className="absolute top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-primary)] bg-[var(--primary)]"
              style={{ left: "-2.125rem" }}
              aria-hidden
            />
            {period && (
              <p className="mb-1.5 font-mono-label text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--primary)]">
                {period}
              </p>
            )}
            <h3 className="font-display mb-1 text-base font-semibold leading-snug sm:text-lg">
              {exp.title}
            </h3>
            <p className="mb-1.5 text-[0.85rem] font-medium text-[var(--text-secondary)]">
              {exp.organization}
              {exp.location && ` — ${exp.location}`}
            </p>

            {exp.description && (
              <p className="text-[0.82rem] leading-relaxed text-[var(--text-secondary)]">
                {exp.description}
              </p>
            )}
            {exp.highlights.length > 0 && (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.82rem] leading-relaxed text-[var(--text-secondary)] marker:text-[var(--primary)]">
                {exp.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
