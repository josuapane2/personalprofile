-- Initial content for Josua Pane's portfolio.

INSERT INTO profile (name, title, bio, location, email, phone, linkedin_url, github_url) VALUES (
  'Josua Pane',
  'Sales & Data Analyst',
  'Analyst experienced in large-scale retail data, reporting automation, sales operations, and dashboard development.',
  'Jakarta, Indonesia',
  'panejwork@gmail.com',
  '+62 813-4633-3059',
  'https://linkedin.com/in/josuapane/',
  'https://github.com/josuapane13'
);

INSERT INTO experiences (category, title, organization, location, period_start, period_end, highlights, sort_order) VALUES
('work', 'Sales General Trade Analyst', 'Charoen Pokphand Food', 'Jakarta, Indonesia (On-site)', 'April 2026', 'Present',
 '["Supervise development of the company sales automation platform and translate business needs into a prioritized roadmap.","Own the rollout experience as liaison between 30+ distributors and the system vendor.","Deliver Power BI sales analytics across 5,000+ outlets, saving 12 reporting hours per week.","Conducted GPS-targeted market research that contributed to a 35% increase in new partner outlets."]', 1),
('work', 'Data & Information Staff', 'Ministry of Transmigration', 'Jakarta, Indonesia (On-site)', 'November 2025', 'April 2026',
 '["Coordinated and analyzed operational data across 16 national projects.","Built AI reporting workflows with n8n that reduced manual reporting time from days to hours."]', 2),
('work', 'Data Quality Checks & Business Analyst Trainee', 'GOVOKASI Indonesia', 'Jakarta, Indonesia (Hybrid)', 'November 2025', 'April 2026',
 '["Validated more than 80,000 retail sales records.","Analyzed CRM and pipeline data for 30 active leads weekly and produced recurring Excel reports."]', 3);

INSERT INTO experiences (category, title, organization, location, description, highlights, sort_order) VALUES
('education', 'Bachelor of Informatics', 'Telkom University', 'Bandung, Indonesia', 'GPA: 3.58/4.00',
 '["Machine Learning","Data Visualization","Project Management","Entrepreneurship"]', 1),
('leadership', 'Student Activities', 'Telkom University', 'Bandung, Indonesia',
 'Participated in the Informatics Student Council, CCI Laboratory, and English Debate Club.', '[]', 1),
('publication', 'Natural Language Processing Research', '8th International Conference on Data Science and Its Applications (ICoDSA)', NULL,
 'Final thesis research presented at the 8th ICoDSA Data Science Conference.', '[]', 1);

INSERT INTO experiences (category, title, organization, period_start, sort_order) VALUES
('certification', 'Procurement Manager Professional Certification', 'MTF Institute', NULL, 1),
('certification', 'Data Analysis: Fullstack Intensive Bootcamp', 'MySkill', NULL, 2),
('certification', 'Machine Learning 2024 Batch 1', 'Bangkit Academy', '2024', 3);

INSERT INTO skill_groups (name, sort_order) VALUES
('Data Analysis', 1),
('Business & Sales', 2),
('Visualization & Reporting', 3),
('Automation & Tools', 4),
('Languages', 5);

INSERT INTO skills (group_id, name, sort_order)
SELECT id, unnest(ARRAY['Python','SQL','Data Cleaning','Statistical Analysis','Predictive Analysis','Process Improvement']), generate_series(1,6)
FROM skill_groups WHERE name = 'Data Analysis';

INSERT INTO skills (group_id, name, sort_order)
SELECT id, unnest(ARRAY['CRM Analysis','Business Reporting','Sales Operations','ERP (SAP)','Market Research']), generate_series(1,5)
FROM skill_groups WHERE name = 'Business & Sales';

INSERT INTO skills (group_id, name, sort_order)
SELECT id, unnest(ARRAY['Power BI','Tableau','Microsoft Excel','Pivot Tables','XLOOKUP','VBA']), generate_series(1,6)
FROM skill_groups WHERE name = 'Visualization & Reporting';

INSERT INTO skills (group_id, name, sort_order)
SELECT id, unnest(ARRAY['n8n','Zapier','Jira','PHP','Data Pipelines']), generate_series(1,5)
FROM skill_groups WHERE name = 'Automation & Tools';

INSERT INTO skills (group_id, name, sort_order)
SELECT id, unnest(ARRAY['Indonesian (Native)','English (C2)','German (A1)']), generate_series(1,3)
FROM skill_groups WHERE name = 'Languages';

INSERT INTO projects (title, subtitle, description, tags, year, doc_url, image_url, featured, sort_order) VALUES
('Sales Performance Analytics', 'Charoen Pokphand Food | Power BI', 'Developed sales and customer-tier reporting across more than 5,000 outlets, saving approximately 12 reporting hours each week.', '["Power BI","Sales Analytics","Retail Data","Business Reporting"]', '2026', '/assets/sales-performance-analyst.pdf', NULL, true, 1),
('GPS-Targeted Outlet Research', 'Charoen Pokphand Food | Market Intelligence', 'Created GPS-targeted lead lists that contributed to a 35% increase in new partner outlets.', '["Python","Web Crawling","Market Research","Geospatial Data"]', '2026', '/assets/gps-targeted-outlet-research.pdf', NULL, true, 2),
('AI Reporting Automation', 'Ministry of Transmigration | n8n', 'Automated reporting for 16 national projects, reducing a multi-day manual process to hours.', '["n8n","Workflow Automation","Operational Data","Reporting"]', '2026', NULL, '/assets/n8n-workflow.jpg', true, 3),
('FitFoody Nutrition Tracking App', 'Bangkit Academy | Computer Vision', 'Built an Android nutrition-tracking application for Indonesian cuisine. Processed scraped food datasets and analyzed more than 10,000 records to improve data quality for food classification and nutrition-analysis models.', '["Computer Vision","Machine Learning","Data Processing","Android"]', '2024', '/assets/fitfoody.pdf', NULL, true, 4);
