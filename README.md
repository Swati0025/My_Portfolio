# Swati Sharma Portfolio and Writer Studio

A Next.js App Router writer portfolio with an optional Supabase-backed publishing CMS in the same project. The existing portfolio remains public; `/admin` is a protected editor for stories, poems, articles, profile details, and media.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Supabase Postgres, Supabase Auth, Supabase Storage, Row Level Security
- Tiptap editor storing structured JSON (poem line breaks and paragraph boundaries are retained)
- No service-role key is used by the app; server and browser clients use the Supabase publishable/anon key with RLS

## Configure Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/migrations/202610110001_writer_cms.sql`](supabase/migrations/202610110001_writer_cms.sql), then [`supabase/migrations/202610110002_book_reviews.sql`](supabase/migrations/202610110002_book_reviews.sql). They create the admin allowlist, writer profile, unified writing table, indexes, RLS policies, public `writer-media` bucket, and the dedicated review content type. If migration 001 was already applied, run migration 002 to enable reviews.
3. In Supabase Authentication, disable public sign-ups. Create the writer account from the dashboard (Authentication → Users → Add user), then confirm the email if your project requires it.
4. Add only the writer account to the admin allowlist. Replace the UUID with the Auth user ID shown in Supabase:

   ```sql
   insert into public.admin_users (user_id)
   values ('00000000-0000-0000-0000-000000000000');
   ```

5. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (recommended) or `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

   These two values are public client credentials. Do not put a service-role key in this project or expose one in browser code.
6. Restart the development server after editing environment variables. Visit `/admin/login` and sign in with the authorized Supabase Auth account.

The login page explains that setup is missing when these environment variables are absent. Admin routes and every write action verify allowlist membership server-side; database RLS remains the final authorization boundary. A signed-in but non-allowlisted user is signed out.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the public portfolio and `http://localhost:3000/admin/login` for Writer Studio.

```bash
npm run lint
npm run build
npm start
```

The current public homepage copy and image samples remain available before Supabase is configured. Once Supabase is configured, homepage writing cards, writing listings/detail pages, and editable profile details read from the database; if there are no published records, the public lists show an empty state. Drafts are never selected by the public data layer and are denied to anonymous users by RLS.

## CMS routes

- `/admin/login` — Supabase Auth sign-in
- `/admin/dashboard` — published totals, draft total, recently edited content
- `/admin/story`, `/admin/poem`, `/admin/article`, `/admin/review` — search/filter content lists
- `/admin/[type]/new` and `/admin/[type]/[id]` — Tiptap editor, draft/publish, private preview, deletion
- `/admin/media` — upload and remove persistent images
- `/admin/settings` — public display name, biography, profile image, email, Instagram and Substack URLs
- `/admin/preview/[id]` — authenticated preview, including drafts
- `/stories`, `/poems`, `/articles`, `/book-reviews` and their `/:slug` pages — published content only

Saving a draft does not make it public. Publishing sets/retains its publication timestamp and makes it available on the relevant public listing and slug page. Saving it as a draft unpublishes it. Successful writes call `revalidatePath`; public pages read the database on request, so publication changes do not require a source edit or deployment.

Poems are stored as Tiptap JSON, not flattened HTML. Use Enter for stanza/paragraph breaks and Shift+Enter for a line break. The public renderer maps supported document nodes to React elements and only accepts embedded images from local portfolio assets or the configured `writer-media` bucket.

## Storage and validation

The migration creates a public-read `writer-media` bucket, restricted to JPEG, PNG, WebP, and AVIF up to 5 MB. Upload, update, and delete storage policies require `public.is_admin()`. The Server Action request limit is set to 6 MB to allow the validated 5 MB file plus multipart overhead. Uploads use unique generated filenames; image bytes are not stored in local files, localStorage, or sessionStorage. Use an uploaded public URL in cover/profile fields.

## Deployment

1. Apply the migration to the production Supabase project and add the production writer Auth user to `public.admin_users`.
2. Deploy this Next.js project to a Node-compatible host such as Vercel. Configure `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the deployment environment for every required environment (preview/production), then redeploy.
3. In Supabase Authentication → URL Configuration, set the production Site URL and allowed redirect URLs to the production origin. Keep public sign-ups disabled.
4. Verify `/admin/login`, public published content, and media access on the deployed domain. Use HTTPS in production.

## Data model

- `admin_users`: explicit allowlist mapping Auth user IDs to admin permission.
- `content_items`: shared `story`/`poem`/`article`/`review` records with unique `(type, slug)`, JSONB document, cover/category/tags, draft/published status, and timestamps.
- `writer_profile`: singleton public writer details and social links.
- Storage bucket `writer-media`: public-read images; writes require admin membership.

The workspace contains a Supabase example environment file, but Next.js does not load `.env.example` automatically and no `.env.local` is present. The SQL migration and authorized Auth user also have not been applied/verified. Until those setup steps are complete, authenticated CRUD, persistent uploads, and database-backed public content cannot be exercised; the application does not fake successful writes.
