# Arkansas Scratch Finder

A mobile-first sample interface for comparing fictional scratch-off game prize counts and locating games by store display slot.

**All game names, prize counts, prices, slot numbers, and odds are invented. This is not real Arkansas Lottery information.**

## Run locally

```sh
npm install
npm run dev
```

The development server listens on port 5000. To create a production build, run `npm run build`.

## Checks

```sh
npm run build
npm run test:e2e
```

The browser tests start the dev server if needed. Playwright uses the Chromium binary available in Replit; elsewhere, install it with `npx playwright install chromium`.
