# Sakshi Gill — Portfolio

Personal portfolio and blog for **Sakshi Gill**, digital marketer, AI developer and
video editor in Kaithal, Haryana.

Built with React, TypeScript, Vite, GSAP, Three.js and Supabase. The landing page
renders an interactive 3D character; the blog reuses the same visual language.

---

## Quick start

```bash
npm install
cp .env.example .env      # then fill in the values
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on all interfaces |
| `npm run build` | Typecheck, bundle, then prerender the blog, sitemap and robots.txt |
| `npm run prerender` | Re-run only the build-time prerender step |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

`.env` is gitignored. Never commit it, and never put the Supabase
`service_role` key in any file that ships to the browser.

---

## Required environment

| Variable | Needed for |
| --- | --- |
| `SITE_URL` | **Required at build time.** Fills every canonical, Open Graph and sitemap URL. Relative or placeholder values make Google ignore those tags, and the build prints a warning. |
| `VITE_SUPABASE_URL` | Content loading and the Admin Panel |
| `VITE_SUPABASE_ANON_KEY` | Same. This key is public by design. |
| `RESEND_API_KEY` | Contact form email notification |
| `CONTACT_TO_EMAIL` | Where enquiries are emailed |
| `CONTACT_FROM_EMAIL` | The verified Resend sender |

---

## Database setup

Run these in the Supabase SQL editor, in this order:

1. The schema/seed file for a fresh project
   (`supabase/DANGER_schema_wipes_all_data.sql` — read it first, it drops tables).
2. `supabase/admin-security.sql` — locks writes to signed-in users.
3. `supabase/security-hardening.sql` — **required.** Supabase email signups are
   on by default, and until this is run any visitor can register an account and
   edit the site content. Follow the steps at the top of that file, including
   turning off "Allow signups" in Authentication → Providers → Email.
4. `supabase/fix-project-data.sql` — corrects the project copy and the contact
   email in the database so it matches the code.

Content is edited at **/admin**. Blog posts are read from `blog_posts`; when the
table is empty the site falls back to `src/site/blogSeed.json`, which is what
makes the build reproducible.

---

## Contact form

The form writes to `contact_messages` first and then calls the
`notify-contact` edge function, so a message is never lost if email fails.

The edge function is **not deployed by default**. To enable email:

```bash
supabase functions deploy notify-contact
supabase secrets set RESEND_API_KEY=... CONTACT_TO_EMAIL=... CONTACT_FROM_EMAIL=...
```

Until then the form still stores enquiries — read them at
Supabase → Table Editor → `contact_messages` — and tells the visitor that email
could not be sent.

---

## Deployment notes

- `npm run build` must run on the host so `prerender` can read Supabase and
  `SITE_URL`.
- Serve `dist/`. `/blog/<slug>` has a static `index.html` per post, so no SPA
  rewrite is needed for blog pages. `/admin` does need a rewrite to
  `admin.html` on hosts without one (the Vite preview server already does this).
- Keep `robots.txt` and `sitemap.xml` reachable at the site root.

---

## Attribution and licence

This project began as a fork of
[MoncyDev/Portfolio-Website](https://github.com/MoncyDev/Portfolio-Website) by
**Moncy Yohannan**, and keeps the original
[Personal Portfolio License (PPL) v1.0](./LICENSE) and its attribution and
usage notice, as that licence requires.

The 3D character model in `public/models/` and the code structure, GSAP
timelines and design language are the original author's work. Please review
[`LICENSE`](./LICENSE) and the upstream notice before publishing commercially —
in particular the licence marks the 3D assets as proprietary, and the GSAP
Club plugins (`ScrollSmoother`, `SplitText`) currently come from the
`gsap-trial` package. Those plugins are included in the free GSAP distribution
now, so the intended path is to upgrade `gsap` and import them from `gsap/`
instead of `gsap-trial/`.

All portfolio copy, project data, screenshots and blog content are Sakshi Gill's.
