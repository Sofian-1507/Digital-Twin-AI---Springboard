# SKILLS.md

How UI/UX work in this repo goes through Claude Code's `apple-design-skill`. See `CLAUDE.md` for
general repo conventions — this file is specifically about the design-review workflow.

## What it is

`apple-design-skill` is a Claude Code skill that reviews and improves UI against Apple's Human
Interface Guidelines, translated into platform-agnostic principles (this is a React/Tailwind web
app, not a native Apple platform — the skill maps HIG concepts like "control size" and "system
colors" onto their web/CSS equivalents). It's invoked with `/apple-design-skill` and grounds every
finding in a specific guideline reference (`references/hig/*.md`) rather than opinion, so
recommendations come with a citeable "why," not just a "this looks off."

## The workflow used on this project

Design work here follows a four-step cycle, each a separate, explicit request — the skill does not
jump straight to editing code on its own:

1. **Audit** (`/apple-design-skill "do a design audit..."`) — read-only review of pages/components
   against the skill's priority order (Accessibility → Platform Conventions → Visual Design →
   Interaction Design → Content), producing a severity-ranked Design Review Report. No files are
   touched.
2. **Visualize** ("generate an artifact, don't code anything") — when a proposed redesign is large
   enough to want sign-off before touching the real app, it gets mocked up as a static HTML
   Artifact first (see the `artifact-design` skill) using the app's real palette/type tokens, not
   the live components. Nothing in `frontend/` changes at this step either.
3. **Plan** ("generate an implementation plan, don't code anything") — once a direction is
   approved, the fixes get written up as a concrete, file-by-file plan (via Claude Code's plan
   mode) before any edit happens, so the scope of a "fix everything" request is explicit and
   reviewable up front.
4. **Implement** — only after the plan is approved does code change, followed immediately by
   `npx eslint .` and `npx vite build` (see `CLAUDE.md`'s frontend commands) plus a grep sweep
   confirming the specific bug patterns from the audit are actually gone, not just "probably fixed."

Skipping straight from a vague request to code changes has not been how this has worked — every
nontrivial visual change in this repo's history went through at least the audit step first.

## What the audits check for, concretely

These are the actual standards this repo's UI is held to, established by prior audit rounds:

- **Contrast**: every text/background pairing needs ≥4.5:1 (sub-18px text) or ≥3:1 (18px+/bold) —
  checked with real computed WCAG ratios against the actual hex values in `index.css`'s `@theme`
  block, not eyeballed.
- **Touch/click targets**: interactive controls need a real hit area (~28×28px minimum on desktop,
  44×44px default) — a small icon is fine, but its clickable padding must be sized independently of
  the icon's visual size (`p-0` around a 14px icon is a recurring bug class to watch for).
- **Keyboard operability**: anything a mouse can do, a keyboard must also be able to do — this is
  why the sidebar moved off hover-only expand and the custom `Select` component gained arrow-key
  navigation.
- **Dark-mode parity**: every color decision gets checked in both themes, not just light mode.
- **Consistency across pages**: shared components (`EmptyState`, `Skeleton`, `Card`, `Badge`, the
  Login/Signup/Forgot-Password auth shell) should look and behave identically everywhere they're
  used — a page that missed a shared redesign is treated as a bug, not a style choice.

## Where the current design system lives

- Color/radius/shadow tokens: `frontend/src/index.css`'s `@theme` block (the "Field Notes"
  warm paper/ink palette — see the inline comments there for the rationale behind each override).
- Shared primitives: `frontend/src/components/ui/` (per `CLAUDE.md`'s Frontend conventions).
- Chart colors: `frontend/src/utils/chartColors.js` — kept in sync with `index.css` **by hand**
  since Recharts/Plotly take literal hex values, not Tailwind classes. If a token in `index.css`
  changes, check this file too — an audit has already caught it drifting out of sync once.
