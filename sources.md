# Sources

Everything the Board knows comes from here. All fetching happens in the Worker; the
Board itself talks to exactly one URL and never to any of these.

## Weather

**Open-Meteo** — no key, no account, generous free tier.
Location is Rose Garden, San Jose CA; times are `America/Los_Angeles`.

Used for the day's conditions and temperature in °F. Supplies tomorrow's weather too,
which the fourth cell falls back to when nothing is worth counting Sleeps toward.

## School lunch

**MealViewer** — `https://api.mealviewer.com/api/v4/school/SJUSDElementarySchoolsSJUSD/{MM-DD-YYYY}/{MM-DD-YYYY}`

Unauthenticated, no key, CORS-open. The `SJUSDElementarySchoolsSJUSD` slug is
district-wide and is the one Trace uses.

The Entrée is the item with `item_Type === "ENTREES"` and `item_Order_Id: 1`; several
entrées are listed per day and only the first is the hot main.

Two traps. The API returns `200 OK` even when it has nothing, so check the payload shape
rather than the status. And an empty `menuBlocks` array is ambiguous — it means a weekend
*or* a menu not yet published, and the publishing horizon is only about five weeks.
Never read emptiness as a Non-School Day. A weekday closure looks different: a normal
block containing a single sentinel item named `NO SCHOOL!` with a null `item_Type`.

## School events

**ParentSquare** — a per-user iCal subscription URL, kept in `.dev.vars` as
`PARENTSQUARE_ICS_URL` because it authenticates by being unguessable.

This is the school's own feed, so it carries the things that actually change the
Viewer's day. It also carries adult content that must never reach a child's wall — the
live feed currently includes several cancer-awareness workshops, none of which match any
plausible keyword filter. Events are therefore **hidden by default** and shown only on
an explicit allowlist. That default is the safeguard; filtering is not.

Timezones need care: the feed mixes `TZID=America/Los_Angeles` entries with
`VALUE=DATE` entries. Any feed carrying bare-UTC `DTSTART:...T000000Z` stamps is naming
the *previous* day in Pacific time.

## Whether there is school

**`data/school-calendar-2026-2027.json`** — the authority, derived from SJUSD's published
Student Calendar PDF and checked in. Regenerate each August:

```
python3 tools/extract-school-calendar.py <new-calendar>.pdf
```

Not a feed, and deliberately so — no published calendar states the full closure set, and
public-holiday libraries get SJUSD wrong in both directions. See
`docs/adr/0003-bedrock-school-calendar.md`. The elementary/secondary distinction matters:
some early-dismissal blocks do not apply to the Viewer.

## Not used

**The Trace PTO Google Calendar** — an organisation's working calendar of fundraisers and
committee meetings. About 92% of its entries change nothing about the Viewer's day, its
naming is inconsistent, it states no closures at all, and where it overlaps ParentSquare
it sometimes disagrees on the date. ParentSquare covers the same ground and is the
school's own record, so the PTO Calendar is not a source.

