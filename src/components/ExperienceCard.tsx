import { Briefcase, GraduationCap, Award, Users, BookOpen } from "lucide-react";
import type { Experience, ExperienceCategory } from "@/lib/types";

const categoryIcons: Record<ExperienceCategory, React.ReactNode> = {
  work: <Briefcase size={18} />,
  education: <GraduationCap size={18} />,
  leadership: <Users size={18} />,
  certification: <Award size={18} />,
  publication: <BookOpen size={18} />,
};

export default function ExperienceCard({ experience }: { experience: Experience }) {
  const period = [experience.period_start, experience.period_end]
    .filter(Boolean)
    .join(" — ");

  return (
    <article className="glass-card group relative rounded-2xl p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {categoryIcons[experience.category]}
        </div>
        {period && (
          <span className="shrink-0 rounded-full bg-card-border/50 px-3 py-1 text-xs text-muted">
            {period}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
        {experience.title}
      </h3>
      <p className="mt-1 font-medium text-accent-secondary">{experience.organization}</p>
      {experience.location && (
        <p className="mt-1 text-sm text-muted">{experience.location}</p>
      )}
      {experience.description && (
        <p className="mt-3 text-sm text-muted">{experience.description}</p>
      )}

      {experience.highlights.length > 0 && (
        <ul className="mt-4 space-y-2">
          {experience.highlights.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
