alter table public.content_items
  drop constraint if exists content_items_type_check;

alter table public.content_items
  add constraint content_items_type_check
  check (type in ('story', 'poem', 'article', 'review'));
