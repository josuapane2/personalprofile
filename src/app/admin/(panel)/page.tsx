import Link from "next/link";
import {
  User,
  Briefcase,
  FolderKanban,
  Sparkles,
  Mail,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUi";
import {
  getProfile,
  getExperiences,
  getProjects,
  getSkillGroups,
  getContactMessages,
} from "@/lib/data";

const cards = [
  { href: "/admin/profile", label: "Profile", icon: User, color: "text-cyan-400" },
  { href: "/admin/experience", label: "Experience", icon: Briefcase, color: "text-violet-400" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, color: "text-amber-400" },
  { href: "/admin/skills", label: "Skills", icon: Sparkles, color: "text-emerald-400" },
  { href: "/admin/messages", label: "Messages", icon: Mail, color: "text-rose-400" },
];

export default async function AdminDashboard() {
  const [profile, experiences, projects, skillGroups, messages] =
    await Promise.all([
      getProfile(),
      getExperiences(),
      getProjects(),
      getSkillGroups(),
      getContactMessages(),
    ]);

  const unreadMessages = messages.filter((m) => !m.read).length;
  const totalSkills = skillGroups.reduce((a, g) => a + g.skills.length, 0);

  const stats = [
    { label: "Experiences", value: experiences.length },
    { label: "Projects", value: projects.length },
    { label: "Skills", value: totalSkills },
    { label: "Unread Messages", value: unreadMessages },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description={`Welcome back. Manage ${profile.name}'s portfolio content from one place.`}
        action={
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
          >
            <ExternalLink size={15} /> View website
          </Link>
        }
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <p className="text-3xl font-bold text-accent">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Manage content</h2>
        <p className="mt-1 text-sm text-muted">Choose a section to update.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="glass-card group flex items-center justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <card.icon className={card.color} size={22} />
              <span className="font-medium">{card.label}</span>
            </div>
            <ArrowRight
              size={16}
              className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
