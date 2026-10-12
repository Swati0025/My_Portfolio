create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('story', 'poem', 'article', 'review')),
  title text not null check (length(trim(title)) between 1 and 180),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null default '',
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  cover_image text,
  category text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique (type, slug)
);

create index if not exists content_items_public_listing_idx
  on public.content_items (type, published_at desc)
  where status = 'published';
create index if not exists content_items_updated_idx on public.content_items (updated_at desc);

create or replace function public.set_content_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'published') then
    new.published_at = coalesce(new.published_at, now());
  elsif new.status = 'draft' then
    new.published_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists content_items_updated_at on public.content_items;
create trigger content_items_updated_at
before insert or update on public.content_items
for each row execute function public.set_content_updated_at();

create table if not exists public.writer_profile (
  id boolean primary key default true check (id),
  display_name text not null default 'Swati Sharma',
  biography text not null default '',
  profile_image text,
  email text,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.writer_profile (id) values (true) on conflict (id) do nothing;

alter table public.admin_users enable row level security;
alter table public.content_items enable row level security;
alter table public.writer_profile enable row level security;

create policy "Admins can read admin allowlist"
  on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
create policy "Public can read published content"
  on public.content_items for select to anon, authenticated using (status = 'published');
create policy "Admins can read all content"
  on public.content_items for select to authenticated using (public.is_admin());
create policy "Admins can insert content"
  on public.content_items for insert to authenticated with check (public.is_admin());
create policy "Admins can update content"
  on public.content_items for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete content"
  on public.content_items for delete to authenticated using (public.is_admin());
create policy "Public can read writer profile"
  on public.writer_profile for select to anon, authenticated using (true);
create policy "Admins can update writer profile"
  on public.writer_profile for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can insert writer profile"
  on public.writer_profile for insert to authenticated with check (public.is_admin());

grant select on public.content_items, public.writer_profile to anon, authenticated;
grant insert, update, delete on public.content_items to authenticated;
grant insert, update on public.writer_profile to authenticated;
grant select on public.admin_users to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('writer-media', 'writer-media', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view writer media"
  on storage.objects for select to anon, authenticated using (bucket_id = 'writer-media');
create policy "Admins can upload writer media"
  on storage.objects for insert to authenticated with check (bucket_id = 'writer-media' and public.is_admin());
create policy "Admins can update writer media"
  on storage.objects for update to authenticated using (bucket_id = 'writer-media' and public.is_admin()) with check (bucket_id = 'writer-media' and public.is_admin());
create policy "Admins can delete writer media"
  on storage.objects for delete to authenticated using (bucket_id = 'writer-media' and public.is_admin());
