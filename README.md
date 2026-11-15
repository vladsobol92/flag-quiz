# Capitals of Europe — flag flashcards

React + TypeScript + Vite + Tailwind. 45 European countries, flag → pick the capital from 4 options.

## Quick look (no install)
Double-click `bundle.html` — it's the whole app in one file.

## Run the source locally (macOS)
Requires Node.js 20.19+ and pnpm.

```bash
brew install node        # if you don't have Node
npm install -g pnpm      # or: corepack enable
pnpm install
pnpm dev                 # open http://localhost:5173
```

Other commands:
- `pnpm build` — production build into `dist/`
- `pnpm preview` — serve the built `dist/`

## Where things are
- `src/countries.ts` — country / capital / region list (add or remove countries here)
- `src/flags.ts` — flag SVG imports (from `country-flag-icons`); keep in sync with countries.ts
- `src/App.tsx` — the quiz: start screen, card, answers, results
- `tailwind.config.js` — colours (paper, ink, moss, brick) and fonts

## Deployment (Netlify)
Build settings live in `netlify.toml` (`pnpm build` → `dist/`).

- Netlify deploys automatically on every push to `main`.
- Manual deploy from GitHub: **Actions** → **Trigger Netlify deploy** → **Run workflow**
  (needs the `NETLIFY_BUILD_HOOK` repository secret).
