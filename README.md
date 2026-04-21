# La Dante HK — demo redesign

A premium, mobile-responsive redesign of ladante.cc, the Dante Alighieri Society of Hong Kong (Italian & Latin language school since 1935).

Built for **demo presentation** to convince the client to move off WordPress.

## What's in the box

- **Homepage** — mural-led hero, trust band, featured carousel, 4 course circles, membership band, workshops, bookclub/library/membership trio, Instagram strip, sponsors, reviews carousel, newsletter
- **Courses** — index + Italian Adult Groups (CEFR accordion template) + Private, Kids, Corporate, Online, Latin, Study in Italy, Teacher Training
- **Interactive Placement Test** — 30-question adaptive CEFR-aligned test with recommendation + email capture
- **Membership form** — 4-step wizard (Plan → You → Review → Confirm), 4 plans, interests chips
- **Admin dashboard** — password-gated (`dante2026`), course CRUD wizard, workshops, overview, settings
- **Chatbot "Dantina"** — floating rule-based FAQ bot on all public pages
- **Entry pop-up** — session-dismissible new-term promo
- **SEO** — sitemap + robots + rich metadata
- **PLIDA, Culture (events + workshops), About (with mural story), Contact, Typhoon policy, Legal, Gift, Merch, Services (Translation, Sponsorship)**

## Stack

- Next.js 16 + React 19 (App Router, static generation)
- TypeScript
- Tailwind CSS v4
- League Spartan + Poppins (Google Fonts)
- lucide-react icons
- Local-storage-backed demo CMS (Phase 2 → Supabase/Neon)

## Local dev

```bash
npm install
npm run dev
```

Then http://localhost:3000

## Admin

- Visit `/admin`
- Password: `dante2026`
- Courses you create persist in your browser's localStorage
- "Reset demo data" button on the overview page wipes it

## Deploy

```bash
vercel deploy --prod
```
