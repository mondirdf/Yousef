# Legacy components archive

This folder contains the old modular section components that are **not wired into the active App Router pages**.

## Why archived
- The current implementation is a single-page build in `app/page.tsx`.
- None of these components are imported by `app/layout.tsx` or any file under `app/`.

## Reactivation
If you decide to return to a modular architecture, you can move selected components back to `components/` and import them in `app/page.tsx`.

### Archived files
- AboutSection.tsx
- CreatorIdentitySections.tsx
- Footer.tsx
- HeroSection.tsx
- Navbar.tsx
- PortfolioSection.tsx
- SkillsSection.tsx
- SocialSection.tsx
- YouTubeSection.tsx
