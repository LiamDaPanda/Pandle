# Pandle — Bamboo Grove

A cute panda **picross / nonogram** puzzle game. Use the number clues on each row
and column to deduce which cells are filled — solve the grid and a hidden, colored
panda picture is revealed! Every puzzle is guaranteed solvable by **pure logic, no
guessing**.

Built as an installable **PWA** (works great on iPhone — add to Home Screen for a
full-screen, offline experience).

## Features

- **Picross puzzles** with a satisfying colored-art reveal
- **No guessing, ever** — a logical solver validates every puzzle at build time
- **Daily puzzle** — one shared puzzle per day, with streaks and a shareable result
- **Adventure mode** — level-based progression across chapters, earn 1-3 stars
- **Events** — limited-time, date-windowed themed puzzle packs with rewards
- **Practice** — endless random puzzles by difficulty
- **Customization** — unlockable themes, effect packs, and panda skins (spend bamboo)
- **Effects** — celebratory particle bursts (with a reduced-motion option)

## Tech

React + TypeScript + Vite, `vite-plugin-pwa`. All state is client-side
(`localStorage`) — no backend or accounts.

## Develop

```bash
npm install
npm run dev        # local dev server
npm test           # unit tests (incl. the no-guess puzzle gate)
npm run build      # production build (also type-checks)
npm run preview    # preview the production build
npm run gen:icons  # regenerate the PWA panda icons
```

## How the "no guessing" guarantee works

`src/game/solver.ts` implements a line solver with constraint propagation. For each
puzzle it repeatedly applies only *forced* moves; if that fully determines the grid,
the puzzle is logic-solvable (and therefore unique). `src/__tests__/puzzles.noGuess.test.ts`
runs this check over **every** shipped puzzle, so a puzzle that would require guessing
fails CI and can never ship.

## Adding a puzzle

Add an entry to `src/data/puzzles.ts`. The grid is a compact char array: `.` is empty,
any other letter is a filled cell whose letter picks a reveal color (see `PALETTE` in
`src/game/types.ts`). Clues are derived automatically. Run `npm test` — if your art
needs guessing, the no-guess test will tell you.

## Deploy

GitHub Pages serves this branch's repo root directly, so the built app is
committed at the root. After changing the app, run:

```bash
npm run build && npm run sync:pages
```

then commit and push — the site updates on its own. (The app source entry
lives in `src/index.html`; `vite.config.ts` sets `root: 'src'` so the repo
root stays free for the build output. `.github/workflows/deploy.yml` still
runs tests and a build as CI on every push.)
