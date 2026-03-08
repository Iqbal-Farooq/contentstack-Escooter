# Next.js Front End – Contentstack Headless Display

Production-ready Next.js 14+ (App Router) app that displays content from Contentstack via the Delivery API.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ESLint + Prettier**
- **@contentstack/delivery-sdk**

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example env file and fill in your Contentstack credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your_api_key
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=your_environment
# Optional: NEXT_PUBLIC_CONTENTSTACK_REGION=us
```

Get these from Contentstack: **Stack Settings → API Keys / Delivery Tokens**.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
frontend/
├── app/
│   ├── api/              # API routes (e.g. health)
│   ├── (auth)/           # Auth route group (login, signup)
│   ├── (marketing)/      # Marketing route group
│   ├── layout.tsx        # Root layout, fetches Header from Contentstack
│   ├── page.tsx          # Home
│   ├── loading.tsx       # Loading UI
│   ├── error.tsx         # Error boundary
│   └── globals.css
├── components/
│   ├── layout/           # Header, etc.
│   ├── navigation/       # NavDropdown, MobileMenu
│   └── ui/               # Button, Link
├── lib/
│   ├── contentstack.ts   # SDK config + fetchHeader()
│   ├── fetcher.ts        # Generic fetch helper
│   └── utils.ts          # cn() etc.
└── types/
    ├── header.types.ts   # HeaderData, Logo, PrimaryCTA, etc.
    └── navigation.types.ts # NavItem, ChildLink, SecondaryLink
```

## Header

The **Header** is loaded in `app/layout.tsx` via `fetchHeader()` and passed to `<Header data={headerData} />`. It supports:

- **Left:** Logo (image + link)
- **Center:** Navigation with optional dropdowns (hover on desktop)
- **Right:** Secondary links (e.g. Log In), primary CTA button (e.g. Sign Up)
- **Mobile:** Hamburger menu with expandable nav items
- **Sticky** header (configurable from Contentstack)
- **Accessible** (ARIA attributes, keyboard-friendly)

If Contentstack env vars are missing or the API fails, a fallback message is shown in the header.

## Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start dev server               |
| `npm run build`| Production build (static export) |
| `npm run start`| Start production server        |
| `npm run lint` | Run ESLint                     |
| `npm run format` | Format with Prettier         |

## Deploying to GitHub Pages

The app is built as a **static export** (`output: 'export'`), so it can be hosted on GitHub Pages.

### 1. Repo layout

The workflow expects the Next.js app in a `frontend` folder at the repo root. If your repo root **is** the frontend (no parent folder), move `.github` into it and in the workflow set `working-directory: .` and `path: out`.

### 2. GitHub repo settings

1. **Secrets** (Settings → Secrets and variables → Actions): add  
   `NEXT_PUBLIC_CONTENTSTACK_API_KEY`, `NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN`, `NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT`.
2. **Pages** (Settings → Pages): under “Build and deployment”, set **Source** to **GitHub Actions**.

### 3. Deploy

Push to `main` (or run the “Deploy to GitHub Pages” workflow manually). The workflow builds the app and deploys the `frontend/out` artifact to GitHub Pages.

- **Project site** (`https://<user>.github.io/<repo>/`): base path is set automatically.
- **User/org site** (repo named `*.github.io`): base path is `/`.

### 4. Notes

- **API routes** (e.g. `/api/health`) are **not** available on static export; they only work when running `next start`.
- Images use `unoptimized: true` for static export (no Next.js image server).

## Contentstack content types

- **Header** (global): Logo, Navigation reference, CTA global field, Secondary links group, Sticky, Show search.
- **Navigation** (reference): Title, Links group (label, url, open_in_new_tab, has_dropdown, child_links).
- **CTA** (global field): Button text, Button URL, Open in new tab, Style.

See `docs/05-header-content-type-fields.md` and `content-models/` in the repo root for schema details.
