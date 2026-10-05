-- ============================================================================
-- Security hardening for the portfolio CMS
-- ============================================================================
-- Run this once in: Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- WHY THIS IS NEEDED
--   * supabase/admin-security.sql grants every write to the `authenticated`
--     role, and Supabase email signups are currently OPEN. That combination
--     means any visitor could create an account and rewrite the site content.
--   * The `anon` role holds table-level UPDATE/DELETE grants on site_images
--     and contact_messages that it does not need. RLS is currently filtering
--     those out, but the grants should not be there in the first place.
--   * The public blog policy exposes every row, including unpublished drafts.
--
-- HOW TO RUN IT SAFELY
--   STEP 1 creates the admin table and helper.
--   STEP 2 registers you as the admin, and it MUST run before STEP 3. If the
--   policies change first you will lock yourself out of /admin.
--
--   1. Run STEP 1.
--   2. Run STEP 2. The check query at the bottom of that step must return
--      exactly one row, with your own email on it.
--   3. Run STEP 3 onwards.
--   4. Authentication -> Providers -> Email -> switch OFF "Allow signups".
--      This is what stops anyone else from creating an account at all.
--   5. Sign out and back in at /admin to confirm you can still edit.
--
-- The whole file is idempotent: running it twice changes nothing.
--
-- ---------------------------------------------------------------------------
-- AFTER YOU FINISH: go to Authentication -> Users and delete every account you
-- do not recognise. Disable signups (step 4) stops new ones, but it does not
-- remove accounts that were created while it was still open.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- STEP 1 - the admin table and the helper every policy will use
-- ---------------------------------------------------------------------------
create table if not exists public.studio_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.studio_admins is
  'Supabase Auth users allowed to edit the portfolio content.';

alter table public.studio_admins enable row level security;

-- No policy = no direct access. Only this function reads the table.
revoke all on table public.studio_admins from anon, authenticated;

create or replace function public.is_studio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.studio_admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_studio_admin() from public;
grant execute on function public.is_studio_admin() to authenticated;


-- ---------------------------------------------------------------------------
-- STEP 2 - register yourself as the studio admin (RUN BEFORE STEP 3)
--
-- Put YOUR email on the line below. It must match the account you sign in to
-- /admin with, exactly. It is looked up in auth.users, so you do not need to
-- find a UUID anywhere.
-- ---------------------------------------------------------------------------
insert into public.studio_admins (user_id)
select id
from auth.users
where lower(email) = lower('divinesakshi03@gmail.com')  -- <-- YOUR EMAIL
on conflict (user_id) do nothing;

-- Sanity check: this must return EXACTLY ONE row before you continue.
-- If it returns zero, the email above does not match an existing auth user:
--   create the user first at Authentication -> Users -> Add user, then re-run.
-- If it returns more than one, two accounts share that email - delete the
-- ones you do not own (see the reminder at the end of this file).
select u.email, a.user_id, a.created_at
from public.studio_admins a
join auth.users u on u.id = a.user_id;



-- ---------------------------------------------------------------------------
-- STEP 3 - only studio admins can write
-- ---------------------------------------------------------------------------
drop policy if exists "site_content_admin_write" on public.site_content;
create policy "site_content_admin_write"
  on public.site_content for all to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists "capabilities_admin_write" on public.capabilities;
create policy "capabilities_admin_write"
  on public.capabilities for all to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write"
  on public.projects for all to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists "blog_posts_admin_write" on public.blog_posts;
create policy "blog_posts_admin_write"
  on public.blog_posts for all to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

-- site_images is written by the Admin Panel's image slots.
drop policy if exists "site_images_admin_write" on public.site_images;
create policy "site_images_admin_write"
  on public.site_images for all to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

-- The anon role never needs to change anything.
revoke insert, update, delete
  on public.site_content from anon;
revoke insert, update, delete
  on public.capabilities from anon;
revoke insert, update, delete
  on public.projects from anon;
revoke insert, update, delete
  on public.blog_posts from anon;
revoke insert, update, delete
  on public.site_images from anon;


-- ---------------------------------------------------------------------------
-- STEP 4 - the public still reads everything it should
-- ---------------------------------------------------------------------------
drop policy if exists "site_content_read" on public.site_content;
create policy "site_content_read"
  on public.site_content for select to anon using (true);

drop policy if exists "capabilities_read" on public.capabilities;
create policy "capabilities_read"
  on public.capabilities for select to anon using (true);

drop policy if exists "projects_read" on public.projects;
create policy "projects_read"
  on public.projects for select to anon using (true);

drop policy if exists "site_images_read" on public.site_images;
create policy "site_images_read"
  on public.site_images for select to anon using (true);

-- Drafts must not be readable by visitors. This is skipped when the blog has
-- not been migrated yet, because the column does not exist before that.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'blog_posts'
      and column_name = 'published'
  ) then
    execute 'drop policy if exists "blog_posts_read" on public.blog_posts';
    execute 'create policy "blog_posts_read" on public.blog_posts
             for select to anon using (published)';
    raise notice 'blog_posts: public reads are now limited to published posts.';
  else
    raise notice 'blog_posts: no "published" column yet, public read policy left as is.';
  end if;
end $$;


-- ---------------------------------------------------------------------------
-- STEP 5 - contact_messages: anyone may send, nobody may read or delete
-- ---------------------------------------------------------------------------
drop policy if exists "contact_messages_insert" on public.contact_messages;
create policy "contact_messages_insert"
  on public.contact_messages for insert to anon
  with check (
    char_length(name) between 1 and 120
    and char_length(email) between 3 and 254
    and char_length(message) between 1 and 5000
  );

-- Read your enquiries at Supabase -> Table Editor -> contact_messages.
-- The dashboard bypasses RLS, so revoking table access here is safe.
drop policy if exists "contact_messages_read" on public.contact_messages;

revoke select, update, delete
  on public.contact_messages from anon;
revoke update, delete
  on public.contact_messages from authenticated;
grant insert on public.contact_messages to anon;


-- ---------------------------------------------------------------------------
-- STEP 6 - image storage, scoped to the one bucket this site uses
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- Supabase adds these three by default when a bucket is created, and they apply
-- to EVERY bucket with no owner check. Replace them with bucket-scoped ones.
drop policy if exists "Allow public read access" on storage.objects;
drop policy if exists "Allow public uploads" on storage.objects;
drop policy if exists "Allow public delete" on storage.objects;

drop policy if exists "site_images_public_read" on storage.objects;
create policy "site_images_public_read"
  on storage.objects for select to anon
  using (bucket_id = 'site-images');

drop policy if exists "site_images_admin_write" on storage.objects;
create policy "site_images_admin_write"
  on storage.objects for all to authenticated
  using (bucket_id = 'site-images' and public.is_studio_admin())
  with check (bucket_id = 'site-images' and public.is_studio_admin());

-- NOTE: if you add a second bucket later, give it its own scoped policies
-- instead of restoring the blanket ones above.


-- ---------------------------------------------------------------------------
-- STEP 7 - verify
-- ---------------------------------------------------------------------------
-- Expect public reads on the content tables, is_studio_admin() on every write,
-- and nothing that lets anon insert or update content.
--
-- select tablename, policyname, cmd, roles::text, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
-- order by tablename, policyname;

notify pgrst, 'reload schema';
