-- TECC Newsletter Archive Schema
-- Run this in your Supabase SQL Editor

-- Newsletters table
create table if not exists newsletters (
  id uuid default gen_random_uuid() primary key,
  year int not null,
  month int not null check (month >= 1 and month <= 12),
  title text not null,
  source_type text not null check (source_type in ('url', 'file')),
  source_url text,
  file_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_newsletters_year_month on newsletters (year desc, month desc);

-- Newsletter sections table
create table if not exists newsletter_sections (
  id uuid default gen_random_uuid() primary key,
  newsletter_id uuid not null references newsletters (id) on delete cascade,
  section_title text not null,
  summary text,
  sort_order int not null default 0
);

create index if not exists idx_sections_newsletter on newsletter_sections (newsletter_id);

-- Section links table
create table if not exists section_links (
  id uuid default gen_random_uuid() primary key,
  section_id uuid not null references newsletter_sections (id) on delete cascade,
  label text not null,
  url text not null,
  sort_order int not null default 0
);

create index if not exists idx_links_section on section_links (section_id);

-- Row Level Security
alter table newsletters enable row level security;
alter table newsletter_sections enable row level security;
alter table section_links enable row level security;

-- Public read access
create policy "Public can read newsletters"
  on newsletters for select to anon, authenticated using (true);

create policy "Public can read sections"
  on newsletter_sections for select to anon, authenticated using (true);

create policy "Public can read links"
  on section_links for select to anon, authenticated using (true);

-- Authenticated write access
create policy "Authenticated users can insert newsletters"
  on newsletters for insert to authenticated with check (true);

create policy "Authenticated users can update newsletters"
  on newsletters for update to authenticated using (true);

create policy "Authenticated users can delete newsletters"
  on newsletters for delete to authenticated using (true);

create policy "Authenticated users can insert sections"
  on newsletter_sections for insert to authenticated with check (true);

create policy "Authenticated users can update sections"
  on newsletter_sections for update to authenticated using (true);

create policy "Authenticated users can delete sections"
  on newsletter_sections for delete to authenticated using (true);

create policy "Authenticated users can insert links"
  on section_links for insert to authenticated with check (true);

create policy "Authenticated users can update links"
  on section_links for update to authenticated using (true);

create policy "Authenticated users can delete links"
  on section_links for delete to authenticated using (true);

-- Storage bucket for newsletter files
insert into storage.buckets (id, name, public)
values ('newsletter-files', 'newsletter-files', true)
on conflict (id) do nothing;

create policy "Public can read newsletter files"
  on storage.objects for select using (bucket_id = 'newsletter-files');

create policy "Authenticated users can upload newsletter files"
  on storage.objects for insert to authenticated with check (bucket_id = 'newsletter-files');

create policy "Authenticated users can update newsletter files"
  on storage.objects for update to authenticated using (bucket_id = 'newsletter-files');

create policy "Authenticated users can delete newsletter files"
  on storage.objects for delete to authenticated using (bucket_id = 'newsletter-files');
