import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

export default function ProjectsView({
  featured,
  others,
}: {
  featured: Project[];
  others: Project[];
}) {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {others.length > 0 && (
        <div className="mt-6 border-t border-[var(--border-light)] pt-6">
          <h3 className="font-display mb-1 text-lg font-semibold">Notable projects</h3>
          <p className="mb-4 text-[0.85rem] text-[var(--text-secondary)]">
            Other independent work, utility apps, and academic contributions.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((project) => (
              <article
                key={project.id}
                className="editorial-card p-5 hover:-translate-y-1"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold">{project.title}</h4>
                  {project.year && (
                    <span className="font-mono-label text-[0.6rem] text-[var(--text-muted)]">
                      {project.year}
                    </span>
                  )}
                </div>
                {project.subtitle && (
                  <p className="mb-2 font-mono-label text-[0.6rem] text-[var(--text-muted)]">
                    {project.subtitle.split("|")[0]?.trim()}
                  </p>
                )}
                <p className="mb-3 text-[0.82rem] text-[var(--text-secondary)]">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="skill-item text-[0.6rem]">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
