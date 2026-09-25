# RRULE expansion is bounded to the display window, not the series' history

`worker/src/sources/ics.ts` discards a `VEVENT` — recurring or not — the moment it can
prove the event cannot land inside the window the Frame is about to display, before any
`RRULE` is expanded. A recurring series is then expanded only across that window:
`worker/src/sources/rrule.ts` computes which period index of the rule falls near the
window arithmetically (a division), and never walks the series forward from `DTSTART`
to get there. A future reader benchmarking this against a general-purpose RRULE library
will find one that walks, and should know that was rejected on purpose.

## Considered options

**Walk the series from `DTSTART`.** The obvious implementation, and the one every
general-purpose RRULE library actually ships, because it is correct for free and the
libraries are not written against a CPU budget. It is also the one this file cannot
afford: a personal Google calendar's secret-address feed carries years of history, and a
daily reminder set in 2015 has on the order of 4,000 occurrences behind it by the time
this code runs in 2026. Finding the handful that fall in the next few days by counting up
to them spends CPU on occurrences nobody will ever see, and the free plan's 10 ms per
invocation (ADR 0002) does not distinguish that CPU from useful work.

**Expand everything, then filter.** A smaller mistake than walking every series from its
start, but the same shape: it still generates every occurrence of every series across
however much of the feed the expansion horizon covers, and only discards most of them
afterward. `ics.ts` instead filters *before* expanding, in the same single pass that
parses the feed — `masterCouldReachWindow` rejects a series whose `DTSTART` is after the
window or whose `UNTIL` is before it, at the moment its `VEVENT` finishes parsing, so a
series already proven irrelevant to the window never reaches `expandRRule` at all.

**The Google Calendar API's `timeMin`/`timeMax`.** The API returns already-expanded
instances for exactly the window asked for, which would remove this problem entirely —
no `RRULE`, `EXDATE`, or `RECURRENCE-ID` parsing on this side at all. It costs OAuth,
which #18 rejected in favour of a calendar's secret-address iCal export: no token to
mint, refresh, or store, at the cost of carrying recurrence expansion ourselves. The
cheap auth and the cheap compute are on opposite sides of this tradeoff, and this project
chose cheap auth.

## Consequences

Cost is proportional to the width of the display window, not to how long a series has
been running or how much history the feed carries. `expandRRule`'s strategies reflect
this directly: `FREQ=DAILY` and `FREQ=WEEKLY` without `BYDAY` divide the distance from
`DTSTART` to the window by the rule's period; `FREQ=WEEKLY` with `BYDAY` jumps to the
first eligible week on or after the window and then steps forward only as many weeks as
the window spans; `FREQ=MONTHLY`/`FREQ=YEARLY` estimate a period index the same way, one
level up. None of them contain a loop bounded by the series' age.

The RRULE subset this project's calendars actually need — `FREQ` daily/weekly/monthly/
yearly, `INTERVAL`, `BYDAY`, `COUNT`, `UNTIL`, and `BYMONTH` only alongside `BYDAY` on a
`YEARLY` rule — is therefore a deliberate boundary, not an unfinished one. `BYMONTHDAY`,
`BYYEARDAY`, `BYWEEKNO`, `BYSETPOS`, a `WKST` other than Monday, and sub-daily
frequencies are shapes neither ParentSquare nor a Google Calendar's own UI produces;
`parseRRule` returns `null` for a rule using one, and the caller falls back to the
rule's literal `DTSTART` occurrence rather than guessing at an expansion it cannot
verify.

Measured against a 652 KB, 2,211-`VEVENT` synthetic fixture sized to stand in for a
personal calendar's real history (`worker/test/ics.bench.test.ts`, run in Node/V8, not
a Workers isolate — a bound on the shape of the answer, not the answer itself), a single
feed parses in single-digit milliseconds once the isolate is warm: a median of roughly
4–5 ms, well inside the 10 ms budget. Parsing two such feeds in one invocation — the
shape a cron tick actually needs, since #18 anticipates more than one calendar — lands a
median of roughly 7–9 ms, with a *cold* isolate (paying V8's one-time cost to compile
`ics.ts` and `rrule.ts`) measured as high as ~22 ms for a single feed alone. That is
parsing cost only, before the fetch and the rest of the Frame's render. If the real
feeds turn out to be this size or larger, Workers Paid ($5/month) is a real possibility
this design does not remove, only bound — see the issue this ADR accompanies for the
recorded figures and the honest statement of that risk.
