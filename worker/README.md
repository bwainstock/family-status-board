# Worker

Composes the Viewer's day into a Frame and serves it to the Board.

## The development loop

```
npm install
npm run dev          # wrangler dev
```

Then open <http://127.0.0.1:8787/preview>. The page shows the Frame at true size
with `image-rendering: pixelated`, because a smoothed preview lies about a 1-bit
panel. `/preview.png` is the raw image if you want it on its own.

Any day of the year can be inspected without waiting for it:

```
/preview?date=2026-11-25     # Thanksgiving recess
/preview?date=2027-03-11     # a Minimum Day
```

An unparseable date is a 400 rather than a silent fall back to today.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Serve the preview locally |
| `npm test` | Run everything |
| `npm run test:watch` | Re-run on change |
| `npm run test:goldens` | Accept new golden images |
| `npm run typecheck` | Typecheck `src` and `test` separately |
| `npm run deploy` | Publish the Worker |

`src` is typechecked against Workers types only, so a stray `node:fs` import
fails before it can reach a deploy. Tests get Node types via
`tsconfig.test.json`.

## Layout

| Module | Responsibility |
| --- | --- |
| `src/framebuffer.ts` | The 1-bit buffer. Its byte layout is a contract with the firmware — see ADR 0002 |
| `src/day/` | What is true about a day. Plain objects, no drawing |
| `src/frame/` | Turning a `DayModel` into pixels. No decisions, only drawing |
| `src/preview/` | A 1-bit PNG codec, for humans only. The Board never sees a PNG |

The split at `DayModel` is the point: a timezone bug should fail with a readable
object diff, not an image comparison.

## Golden images

Layout is reviewed the way a human reviews it — by looking at the picture. Each
scenario renders a Frame and compares it to a committed PNG in `test/goldens/`.

When one fails, the harness writes `<scenario>.actual.png` beside the golden and
reports how many pixels moved and where. Open the two side by side, decide
whether the change is the one you meant, then:

```
npm run test:goldens     # rewrites the goldens
git add test/goldens     # the diff in review is the picture itself
```

A missing golden is written and passes, so adding a scenario is one step.
Deleting a golden forces it to be reviewed from scratch.
