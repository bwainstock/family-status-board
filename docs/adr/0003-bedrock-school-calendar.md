# Non-School Days come from a hand-maintained table, not from a calendar feed

The authority on whether the Viewer has school is `data/school-calendar-YYYY-YYYY.json`,
a file a human regenerates once a year from the district's published PDF. The Board
fetches two live calendar feeds, so a future reader will reasonably ask why the single
most load-bearing fact is pinned to a static file instead.

## Considered options

**The ParentSquare feed.** It carries some closures — `NO SCHOOL * 9/28 - 10/02` appears
verbatim — but not others. Thanksgiving, the winter recess, MLK Day and the spring
recess are present only as gaps between events. A gap is indistinguishable from a
quiet week, so the feed can confirm a closure but can never establish one.

**The lunch menu.** MealViewer returns a sentinel item named `NO SCHOOL!` on weekday
closures, which is a genuinely useful cross-check. But an empty `menuBlocks` array means
*either* no school *or* a menu that has not been published yet — the publishing horizon
is only about five weeks. Reading emptiness as closure would silently invent days off.

**A public-holiday library.** This is the trap worth naming, because it looks like the
obvious answer. SJUSD holds school on Indigenous Peoples' Day, and March 2027 contains
no non-school days at all despite Cesar Chavez Day. District recesses also straddle
dates no formula predicts: the 2026 fall recess is a full week in late September. Any
rule-based holiday set is wrong here in both directions.

**The district PDF.** Authoritative, published months ahead, and covering the whole
year in one document. Its cost is that it is a PDF, and that it encodes school days
only as cell shading — the text layer is bare numbers with no indication of which are
holidays. `tools/extract-school-calendar.py` therefore works geometrically, treating any
weekday cell with no shading as a Non-School Day, and the result is checked in.

## Consequences

Someone must run the extraction each August and label the results. This is a real
recurring obligation, and if it is forgotten the Board starts confidently announcing
school on days the school is shut. In exchange, the most important fact the Board knows
is correct a year in advance and cannot be broken by a third party changing their feed.

The extraction cannot determine audience. The district publishes early-dismissal blocks
for elementary and secondary separately, and the distinction exists only in the PDF's
sidebar prose — four days in December and three in May apply to secondary students only.
The tool prints the blocks for a human to match against the sidebar, and the Viewer's
file must carry the elementary set alone.

Because the table is authoritative rather than merely another input, the live feeds are
free to disagree with it without breaking anything. Where MealViewer's `NO SCHOOL!`
sentinel or a ParentSquare entry contradicts the table, that is a signal the table needs
regenerating — most likely a closure added mid-year, such as a storm day, that no
published calendar predicted.
