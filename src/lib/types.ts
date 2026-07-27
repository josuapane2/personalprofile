export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  cv_url: string | null;
  avatar_url: string | null;
}

export type ExperienceCategory =
  | "work"
  | "education"
  | "leadership"
  | "certification"
  | "publication";

export interface Experience {
  id: string;
  category: ExperienceCategory;
  title: string;
  organization: string;
  location: string | null;
  period_start: string | null;
  period_end: string | null;
  description: string | null;
  highlights: string[];
  sort_order: number;
}

export interface SkillGroup {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
  skills: Skill[];
}

export interface Skill {
  id: string;
  group_id: string;
  name: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  tags: string[];
  year: string | null;
  project_url: string | null;
  doc_url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
}
