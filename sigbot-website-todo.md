# SIGBOT-WEBSITE — To-Do: Gmail & IMAP → "Coming Soon"

**Date:** 25 August 2026 · **Priority:** High (web app already shipped this change — site is currently out of sync)
**Context:** The web app no longer offers Gmail or IMAP as live integrations; both now show a "Coming Soon" badge. The marketing site must say the same thing everywhere. Confirmed: **zero users have live Gmail/IMAP connections**, so no migration messaging is needed.

## Task

Update every mention of Gmail and IMAP on the marketing site so neither is presented as currently available. Both should appear as **"Coming Soon" with no date** — do not remove them entirely (they signal roadmap), and do not add a timeline.

## Where to look

Search the whole site codebase (components, CMS content, and any JSON/MD content files) for: `gmail`, `imap`, `google mail`, `email providers`, `integrations`. Typical places these appear:

1. **Integrations / features section** on the homepage — provider logos or list. Keep the Gmail and IMAP entries but grey them out / badge them "Coming Soon".
2. **Pricing page** — if any tier lists "Gmail integration" or "IMAP support" as an included feature, change to "Gmail *(coming soon)*" / "IMAP *(coming soon)*", consistent across all tiers.
3. **Feature/landing pages** — any page or section describing email scanning that names Gmail/IMAP as supported sources.
4. **FAQ / help copy** — answers like "Which email providers does Sigbot support?" must list currently supported providers only, with Gmail and IMAP noted as coming soon.
5. **Metadata & ads surface** — page titles, meta descriptions, and OG tags mentioning Gmail/IMAP support; screenshots or demo images showing a live Gmail/IMAP connect button (replace or crop if any).
6. **Structured data / comparison tables** — any "Sigbot vs X" or feature-matrix content.

## Suggested copy

- Badge text: **Coming Soon** (no date, no quarter, no "2026").
- FAQ line: "Gmail and IMAP support are coming soon. We'll announce it in the app when they're live."
- Do not use phrasing that implies imminence ("launching shortly", "days away").

## Acceptance checks

1. A full-text search of the built site output for "gmail" and "imap" returns only instances accompanied by Coming Soon labelling.
2. No button, link, or CTA on the site initiates or implies a live Gmail/IMAP connection.
3. Pricing page feature lists match the web app's integrations screen.
4. No date or timeframe appears next to either integration.

## One heads-up for the pricing page (separate, but touch it while you're there)

The Starter plan's email cap is **300 emails total (lifetime)** — not monthly. If the pricing page currently states a cap, make sure it reads as a total, e.g. "Scan up to 50 emails/day, 300 total — upgrade to Pro for 2,000/day with no total cap." (Decision confirmed 25 Aug 2026.)
