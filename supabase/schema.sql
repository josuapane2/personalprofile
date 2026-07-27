-- Portfolio Josua Pane - Supabase Schema
-- Run this in Supabase SQL Editor

-- Profile (single row)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  cv_url TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience categories: work, education, leadership, certification, publication
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('work', 'education', 'leadership', 'certification', 'publication')),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  period_start TEXT,
  period_end TEXT,
  description TEXT,
  highlights JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill groups
CREATE TABLE IF NOT EXISTS skill_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES skill_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Portfolio projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  year TEXT,
  project_url TEXT,
  doc_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read skill_groups" ON skill_groups FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

-- Public insert contact
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated full access (admin)
CREATE POLICY "Admin all profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all skill_groups" ON skill_groups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
