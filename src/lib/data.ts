import {
  seedExperiences,
  seedProfile,
  seedProjects,
  seedSkillGroups,
} from "./seed-data";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import type {
  ContactMessage,
  Experience,
  ExperienceCategory,
  Profile,
  Project,
  SkillGroup,
} from "./types";

function isConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Anon client for public reads — avoids cookies so pages stay statically cached. */
function publicClient() {
  return createPublicClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getProfile(): Promise<Profile> {
  if (!isConfigured()) return seedProfile;

  const { data, error } = await publicClient()
    .from("profile")
    .select("*")
    .limit(1)
    .maybeSingle();

  return error || !data ? seedProfile : (data as Profile);
}

export async function getExperiences(
  category?: ExperienceCategory
): Promise<Experience[]> {
  const fallback = category
    ? seedExperiences.filter((experience) => experience.category === category)
    : seedExperiences;

  if (!isConfigured()) return fallback;

  let query = publicClient()
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  return error || !data?.length ? fallback : (data as Experience[]);
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  if (!isConfigured()) return seedSkillGroups;

  const [{ data: groups, error: groupError }, { data: skills, error: skillError }] =
    await Promise.all([
      publicClient()
        .from("skill_groups")
        .select("*")
        .order("sort_order", { ascending: true }),
      publicClient()
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

  if (groupError || skillError || !groups?.length) return seedSkillGroups;

  return groups.map((group) => ({
    ...group,
    skills: (skills ?? []).filter((skill) => skill.group_id === group.id),
  })) as SkillGroup[];
}

export async function getProjects(featuredOnly = false): Promise<Project[]> {
  const fallback = featuredOnly
    ? seedProjects.filter((project) => project.featured)
    : seedProjects;

  if (!isConfigured()) return fallback;

  let query = publicClient()
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (featuredOnly) query = query.eq("featured", true);

  const { data, error } = await query;
  return error || !data?.length ? fallback : (data as Project[]);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!isConfigured()) return [];

  const { data } = await publicClient()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as ContactMessage[]) ?? [];
}
