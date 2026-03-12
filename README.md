# Ramzi.zrt

## Current architecture
The project currently uses a **single-page implementation**:

- `app/page.tsx`: contains the full landing page composition (hero, social links, latest video, what-I-do, CTA).
- `app/layout.tsx`: global shell + metadata.
- `app/api/youtube/route.ts`: server endpoint that fetches/parses YouTube channel data.
- `app/globals.css`: global styles and shared utility classes.

## Components directory status
- Active reusable components are **not used** right now in the page composition.
- Older modular section components were moved to `components/_legacy/` and documented there.

## Legacy note
If you want to switch back from single-page composition to modular sections, restore and import selected files from `components/_legacy/` into `app/page.tsx`.
