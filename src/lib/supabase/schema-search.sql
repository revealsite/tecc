-- Full-text search support - run this in Supabase SQL Editor

-- 1. Add content_text column to store extracted article text
alter table newsletters add column if not exists content_text text;

-- 2. Create a search function that searches across all newsletter content
create or replace function search_newsletters(search_term text)
returns setof uuid
language sql
stable
as $$
  select distinct n.id
  from newsletters n
  left join newsletter_sections ns on ns.newsletter_id = n.id
  left join section_links sl on sl.section_id = ns.id
  where
    n.title ilike '%' || search_term || '%'
    or n.content_text ilike '%' || search_term || '%'
    or n.overall_summary ilike '%' || search_term || '%'
    or exists (
      select 1 from unnest(n.key_topics) as topic
      where topic ilike '%' || search_term || '%'
    )
    or ns.section_title ilike '%' || search_term || '%'
    or ns.summary ilike '%' || search_term || '%'
    or sl.label ilike '%' || search_term || '%';
$$;
