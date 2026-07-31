# SIGBOT marketing website

Static marketing site for [Sigbot](https://sigbot.co) — email-signature → contact-database SaaS.
Plain HTML/CSS/JS, no build step, hosted on **GitHub Pages** with the custom domain **sigbot.co**
(the `CNAME` file). The web app itself lives at **sigbot.app** and is a separate codebase.

## Layout

```
├── CNAME                  # GitHub Pages custom domain (sigbot.co)
├── index.html             # Home
├── get-started.html       # Signup flow — every "Start free" CTA lands here.
│                          # Four stages (account → inbox → first scan → plan),
│                          # front-end only: search assets/js/get-started.js for
│                          # "BACKEND HOOK" for every wire-up point. "Log in"
│                          # still goes to sigbot.app/login.
├── pricing.html           # Plans + Paddle checkout (Paddle.js, live client token)
├── webapp.html            # Product page: web app
├── mobile.html            # Product page: mobile app
├── construction.html      # Industry landing page
├── demo.html              # Hosts the interactive demo (iframe → /demo/)
├── faq.html
├── contact.html           # mailto-based contact form
├── refund.html            # Refund policy (canonical, linked from Terms & footers)
├── terms|privacy|dpa|security|cookies|app-privacy.html
│                          # Redirect stubs → /legal/* (kept so old URLs don't 404)
├── legal/                 # Canonical legal documents (own visual template)
│   ├── legal.css          # Shared styles for all legal pages
│   └── terms|privacy|security|dpa|api-terms|vulnerability-disclosure.html
├── assets/
│   ├── css/               # styles.css (site-wide) + one <page>.css per page
│   ├── js/                # nav.js (shared nav/footer) + one <page>.js per page
│   ├── icons/             # inline-SVG icon set
│   └── *.png / *.svg      # images (paths are load-bearing: og:image URLs point here)
├── favicon.svg / favicon-32.png / apple-touch-icon.png
├── demo/                  # BUILT demo app — generated, do not edit by hand
├── demo-src/              # Vite + TypeScript source of the demo
├── sitemap.xml / robots.txt
```

## Conventions

- **Shared chrome:** every marketing page includes `assets/js/nav.js` just before `</body>`
  (hamburger menu, Products dropdown, footer year). Don't re-add inline copies.
- **Per-page CSS/JS:** page-specific styles/scripts live in `assets/css/<page>.css` and
  `assets/js/<page>.js`, named after the HTML file. Small one-off snippets can stay inline.
- **Legal pages** use their own template: `legal/legal.css` holds the shared palette/header/
  hero/footer; each page keeps only its layout-specific rules inline.
- **Footers** on marketing pages all use the same link set:
  Terms · Privacy · Refunds · Security · DPA · Contact.
- **Domains:** canonical URLs, OG tags, and the sitemap all use `https://sigbot.co`.
  `sigbot.ca` is legacy (GoDaddy-forwarded → sigbot.co). App links point to `https://sigbot.app`.
- **Adding a page:** copy an existing page's `<head>` (favicon links, canonical, OG tags),
  add it to `sitemap.xml`, use the standard nav + footer, include `assets/js/nav.js`.

## The interactive demo

`demo/` is generated output. To change the demo, edit `demo-src/` and rebuild:

```sh
cd demo-src
npm install
npm run build   # tsc && vite build → writes into ../demo/
```

Commit the regenerated `demo/` output together with the source change.

## Deploying

Push to `main` — GitHub Pages serves the repo root. There is no CI build.
Requirements for the site to be live:

1. GitHub Pages enabled on the repo (Settings → Pages → Deploy from branch `main` / root).
   **Pages on a private repo requires a paid GitHub plan** — if the repo is private on a
   free plan, Pages is disabled and the site 404s.
2. Custom domain `sigbot.co` set in the Pages settings (auto-read from `CNAME` on deploy),
   HTTPS enforced once the certificate is issued.
3. DNS (GoDaddy): apex `sigbot.co` → A records `185.199.108.153 / 109 / 110 / 111`,
   `www` → CNAME `goochy545-ux.github.io`. (Already configured.)

## Payments

Checkout is Paddle (merchant of record). `assets/js/pricing.js` holds the **live** client-side
token and price IDs — the token is publishable, not a secret. The checkout domain must be
approved in the Paddle dashboard for `sigbot.co`.
