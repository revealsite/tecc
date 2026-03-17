-- Chat messages table - run this in Supabase SQL Editor
create table if not exists newsletter_chat_messages (
  id uuid default gen_random_uuid() primary key,
  newsletter_id uuid not null references newsletters (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_chat_newsletter on newsletter_chat_messages (newsletter_id, created_at asc);

alter table newsletter_chat_messages enable row level security;

create policy "Public can read chat messages"
  on newsletter_chat_messages for select to anon, authenticated using (true);

create policy "Anyone can insert chat messages"
  on newsletter_chat_messages for insert to anon, authenticated with check (true);
