import {
  Code2,
  BarChart3,
  LineChart,
  Database,
  GitBranch,
  Globe,
  Wrench,
  Languages,
} from "lucide-react";
import type { SkillGroup } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  code: <Code2 size={20} />,
  analytics: <BarChart3 size={20} />,
  chart: <LineChart size={20} />,
  database: <Database size={20} />,
  pipeline: <GitBranch size={20} />,
  api: <Globe size={20} />,
  tools: <Wrench size={20} />,
  languages: <Languages size={20} />,
};

export default function SkillGroupCard({ group }: { group: SkillGroup }) {
  return (
    <div className="glass-card rounded-2xl p-6 transition-all hover:border-accent/30">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          {iconMap[group.icon ?? "code"] ?? <Code2 size={20} />}
        </div>
        <h3 className="font-semibold">{group.name}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-lg border border-card-border bg-background/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/40 hover:text-accent"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}
