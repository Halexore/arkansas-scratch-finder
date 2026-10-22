# Arkansas Scratch Finder

This is a Next.js app with TypeScript and React. It uses invented example games only; there is no live lottery data, backend, database, account system, or image recognition.

## Run in Replit

- Start the app with `npm run dev`.
- The Next.js development server binds to `0.0.0.0:5000` for the Replit web preview.
- Run `npm run build` to check a production build.
- Game ranking and sorting are in `app/ranking.ts`; fictional records are in `app/data.ts`.

Slot edits are in-memory for the current browser session. The photo control only opens a local file picker/camera prompt and does not upload or analyze the selected image.
