import { ArrowRight, Download, GraduationCap, Award } from "lucide-react";
import { Mail, MapPin, Phone } from "lucide-react";
import DataProfileCard from "@/components/DataProfileCard";
import MetricsBar from "@/components/MetricsBar";
import SectionHeader from "@/components/SectionHeader";
import SubHeader from "@/components/SubHeader";
import ProjectsView from "@/components/ProjectsView";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ContactForm from "@/components/ContactForm";
import { GitHubIcon, LinkedInIcon } from "@/components/SocialIcons";
import { assetUrl } from "@/lib/assets";
import {
  getProfile,
  getExperiences,
  getProjects,
  getSkillGroups,
} from "@/lib/data";

const HIGHLIGHTS = [
  {
    label: "Core Focus",
    title: "Sales & Data Analytics",
    description:
      "Transforming retail, sales, and operational data into practical business decisions.",
  },
  {
    label: "Reporting Impact",
    title: "12 Hours Saved Weekly",
    description:
      "Automated recurring reporting across a network of more than 5,000 retail outlets.",
  },
  {
    label: "Market Growth",
    title: "+35% Partner Outlets",
    description:
      "Built GPS-targeted lead lists that helped expand the partner outlet network.",
  },
  {
    label: "Research",
    title: "ICoDSA Presenter",
    description:
      "Presented undergraduate Natural Language Processing research at the 8th ICoDSA.",
  },
];

export default async function HomePage() {
  const [profile, allExperiences, projects, skillGroups] = await Promise.all([
    getProfile(),
    getExperiences(),
    getProjects(),
    getSkillGroups(),
  ]);

  const work = allExperiences.filter((e) => e.category === "work");
  const education = allExperiences.filter((e) => e.category === "education");
  const certifications = allExperiences.filter((e) => e.category === "certification");
  const leadership = allExperiences.filter((e) => e.category === "leadership");
  const publications = allExperiences.filter((e) => e.category === "publication");
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  const nameParts = profile.name.split(" ");

  return (
    <div>
      {/* Hero */}
      <section id="home" className="page-section-first px-6 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:gap-10">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-light)] px-3 py-1 font-mono-label text-[0.65rem] uppercase tracking-[2px] text-[var(--secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--secondary)]" />
              Open to opportunities
            </div>

            <h1 className="font-display text-[clamp(2.2rem,6vw,4.2rem)] font-bold leading-[1.05] tracking-[-1.5px]">
              {nameParts[0]}{" "}
              <span className="italic text-[var(--primary)]">
                {nameParts.slice(1).join(" ")}
              </span>
            </h1>

            <p className="mt-3 max-w-[480px] text-base leading-relaxed text-[var(--text-secondary)]">
              {profile.bio}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a href="#projects" className="btn btn-primary">
                View My Work
                <ArrowRight size={16} />
              </a>
              {profile.cv_url ? (
                <a
                  href={assetUrl(profile.cv_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Download size={16} />
                  Download CV
                </a>
              ) : (
                <a href="#contact" className="btn btn-outline">
                  Get in Touch
                </a>
              )}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <DataProfileCard profile={profile} />
          </div>
        </div>
        <MetricsBar />
      </section>

      {/* Highlights */}
      <section className="page-section mx-auto max-w-[1100px] px-6 sm:px-8">
        <SectionHeader
          label="Highlights"
          title="CV snapshot"
          description="A few measurable results and milestones from my work."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="editorial-card p-5">
              <p className="font-mono-label mb-2 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--primary)]">
                {item.label}
              </p>
              <h3 className="font-display text-[1rem] font-semibold leading-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="page-section mx-auto max-w-[1100px] px-6 sm:px-8">
        <SectionHeader
          label="About Me"
          title={profile.title}
        />
        <div className="mb-6 max-w-none">
          <p className="mb-3 text-justify text-[0.92rem] leading-[1.75] text-[var(--text-secondary)]">
            {profile.bio}
          </p>
          <p className="text-justify text-[0.92rem] leading-[1.75] text-[var(--text-secondary)]">
            My work combines technical analysis with business context. I build Power BI
            dashboards, automate reporting with n8n, validate large datasets, and turn
            CRM and operational data into insights stakeholders can act on.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.id} className="editorial-card p-4">
              <h3 className="font-display mb-2 text-[0.82rem] font-semibold">{group.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span key={skill.id} className="skill-item">{skill.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects - ALL */}
      <section id="projects" className="page-section mx-auto max-w-[1100px] px-6 sm:px-8">
        <SectionHeader
          label="Portfolio"
          title="Selected case studies"
          description="Business problems I have solved through analytics, automation, and data quality."
        />
        <ProjectsView featured={featured} others={others} />
      </section>

      {/* Experience - ALL */}
      <section id="experience" className="page-section mx-auto max-w-[1100px] px-6 sm:px-8">
        <SectionHeader
          label="Experience"
          title="Career timeline"
          description="Professional experience across sales analytics, reporting automation, and business analysis."
        />
        <ExperienceTimeline items={work} />

        {education.length > 0 && (
          <div className="mt-10">
            <SubHeader title="Education" />
            {education.map((edu) => (
              <div key={edu.id} className="editorial-card flex gap-5 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary-light)] text-[var(--primary)]">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{edu.title}</h3>
                  <p className="text-[0.9rem] text-[var(--text-secondary)]">{edu.organization}</p>
                  {(edu.period_start || edu.period_end || edu.description) && (
                    <p className="mt-1 font-mono-label text-[0.7rem] text-[var(--primary)]">
                      {[edu.period_start, edu.period_end].filter(Boolean).join(" — ")}
                      {(edu.period_start || edu.period_end) && edu.description ? " · " : ""}
                      {edu.description}
                    </p>
                  )}
                  {edu.highlights.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {edu.highlights.map((tag) => (
                        <span key={tag} className="skill-item text-[0.65rem]">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {leadership.length > 0 && (
          <div className="mt-10">
            <SubHeader title="Leadership" />
            <ExperienceTimeline items={leadership} />
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mt-10">
            <SubHeader title="Certifications" />
            <div className="grid gap-3 sm:grid-cols-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="editorial-card flex items-start gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--secondary-light)] text-[var(--secondary)]">
                    <Award size={16} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold">{cert.title}</h4>
                    <p className="text-[0.82rem] text-[var(--text-secondary)]">{cert.organization}</p>
                    {cert.period_start && (
                      <p className="mt-0.5 font-mono-label text-[0.65rem] text-[var(--text-muted)]">
                        {cert.period_start}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {publications.length > 0 && (
          <div className="mt-10">
            <SubHeader title="Research" />
            {publications.map((pub) => (
              <div key={pub.id} className="editorial-card p-5">
                <p className="mb-1 font-mono-label text-[0.65rem] uppercase tracking-wide text-[var(--primary)]">
                  {pub.period_start}
                </p>
                <h3 className="font-display text-lg font-semibold">{pub.title}</h3>
                <p className="text-[0.9rem] text-[var(--text-secondary)]">{pub.organization}</p>
                {pub.description && (
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-[var(--text-secondary)]">
                    {pub.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section id="contact" className="page-section mx-auto max-w-[1100px] px-6 pb-16 sm:px-8">
        <SectionHeader
          label="Contact"
          title="Let's work together"
          description="Have a project in mind or just want to say hi? Reach out!"
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="font-display mb-3 text-lg font-semibold">Get in touch</h3>
            <p className="mb-6 text-[0.9rem] text-[var(--text-secondary)]">
               Based in Jakarta, Indonesia and open to analytics and business intelligence opportunities.
            </p>
            <ul className="space-y-4">
              {profile.email && (
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-[var(--primary)]" />
                  <a href={`mailto:${profile.email}`} className="text-[0.9rem] text-[var(--text-secondary)] hover:text-[var(--primary)]">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile.phone && (
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[var(--primary)]" />
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="text-[0.9rem] text-[var(--text-secondary)] hover:text-[var(--primary)]">
                    {profile.phone}
                  </a>
                </li>
              )}
              {profile.location && (
                <li className="flex items-center gap-3">
                  <MapPin size={18} className="text-[var(--primary)]" />
                  <span className="text-[0.9rem] text-[var(--text-secondary)]">{profile.location}</span>
                </li>
              )}
            </ul>

            {(profile.linkedin_url || profile.github_url) && (
              <div className="mt-8">
                <p className="section-tag mb-3">Find me online</p>
                <div className="flex gap-3">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <LinkedInIcon size={18} />
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <GitHubIcon size={18} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <ContactForm email={profile.email} />
        </div>
      </section>
    </div>
  );
}
