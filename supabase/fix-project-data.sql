-- Corrects the two live projects and the contact email in the database.
-- Run this once in Supabase -> SQL Editor (or `supabase db push`).
--
-- Why it is needed: the project rows described template content (a typing
-- sprint with WPM analytics, an "AI curriculum" platform) that does not match
-- the sites they link to. Typing Rush is a neon typing shooter and Gyanix
-- Academy is a coaching institute website for IIT-JEE / NEET / NDA.
--
-- The Admin Panel shows these rows on its next load. Public writes are locked
-- to signed-in admins (see admin-security.sql), which is why this is a script
-- and not a client-side update.

update public.projects
set
  kicker = 'Project 01 · Game',
  title = 'Typing Rush',
  url = 'https://typing-rush-game.vercel.app',
  beneficial_title = 'Why Typing Rush Is Beneficial',
  benefits = $$[
    'Type to Destroy: Incoming enemy ships are destroyed by typing the word on them, so speed and accuracy decide every round.',
    'Neon Arcade Look: Canvas-rendered enemies, particle bursts and a retro-futuristic HUD make practice feel like a game.',
    'Zero Install: Runs entirely in the browser, so it opens instantly on desktop and mobile with nothing to download.'
  ]$$::jsonb,
  position = 1
where key = 'typing-rush';

update public.projects
set
  kicker = 'Project 02 · Website',
  title = 'Gyanix Academy',
  url = 'https://gyanix-acedemy-gyanix-academy-8bqc.vercel.app',
  beneficial_title = 'Why Gyanix Academy Is Beneficial',
  benefits = $$[
    'Trust Above The Fold: A 5.0 Google rating and 84+ Justdial reviews sit where enquiry visitors land, before they scroll.',
    'Results That Sell: District and state ranks, prize ceremonies and Amar Ujala press coverage act as social proof.',
    'Enquiry Built In: WhatsApp and enquiry CTAs sit alongside courses, G-SET scholarship, hostel and faculty details.'
  ]$$::jsonb,
  position = 2
where key = 'gyanix-academy';

update public.site_content
set contact_email = 'divinesakshigmail.com@gmail.com'
where id = 'main';

notify pgrst, 'reload schema';