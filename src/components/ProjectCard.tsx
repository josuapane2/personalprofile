import { ExternalLink, FileText } from "lucide-react";
import { assetUrl } from "@/lib/assets";
import type { Project } from "@/lib/types";

const tagColors: Record<string, string> = {
  "Power BI": "bg-[var(--primary-light)] text-[var(--primary)]",
  Python: "bg-[var(--secondary-light)] text-[var(--secondary)]",
  ML: "bg-[var(--secondary-light)] text-[var(--secondary)]",
};

function getTagStyle(tag: string) {
  for (const key of Object.keys(tagColors)) {
    if (tag.includes(key)) return tagColors[key];
  }
  return "";
}

export default function ProjectCard({ project }: { project: Project }) {
  const previewUrl = project.doc_url
    ? assetUrl(project.doc_url)
    : project.image_url
      ? assetUrl(project.image_url)
      : null;

  return (
    <article className="editorial-card group overflow-hidden hover:-translate-y-[3px]">
      <div className="relative flex aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)]">
        {project.doc_url ? (
          <>
            <iframe
              src={`${previewUrl}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
              title={`${project.title} PDF preview`}
              loading="lazy"
              className="h-full w-full border-0 bg-white"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 font-mono-label text-[0.55rem] uppercase tracking-widest text-white">
                <FileText size={11} />
                PDF Preview
              </span>
            </div>
          </>
        ) : project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl ?? undefined}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="font-mono-label text-[0.6rem] uppercase tracking-widest text-[var(--text-muted)]">
              {project.tags.slice(0, 3).join(" · ")}
            </span>
            <span className="font-display text-lg font-semibold text-[var(--text)]">
              {project.title.split(" ").slice(0, 3).join(" ")}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-2 flex flex-wrap gap-1">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={`font-mono-label rounded-[3px] border border-[var(--border-light)] px-2 py-0.5 text-[0.6rem] uppercase tracking-wide text-[var(--text-secondary)] ${getTagStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display mb-2 text-base font-semibold">{project.title}</h3>
        <p className="mb-3 text-[0.82rem] leading-relaxed text-[var(--text-secondary)]">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3">
          {project.doc_url && (
            <a
              href={assetUrl(project.doc_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] px-3 py-2 font-mono-label text-[0.65rem] font-semibold text-[var(--text-secondary)] transition-all hover:-translate-y-[1px] hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
            >
              <FileText size={12} />
              PDF Report
            </a>
          )}
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] px-3 py-2 font-mono-label text-[0.65rem] font-semibold text-[var(--text-secondary)] transition-all hover:-translate-y-[1px] hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
            >
              <ExternalLink size={12} />
              View
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
