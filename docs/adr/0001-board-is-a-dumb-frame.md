# The Board is a dumb frame

All composition happens off-device: a Cloudflare Worker fetches every source, decides
what the day looks like, and renders a complete Frame. The Board wakes, fetches
26,928 bytes, blits them to the panel, and sleeps. It parses nothing, lays out nothing,
and knows nothing about weather, lunch, or school.

## Consequences

The Board has **no clock**. It never computes what time to wake next — the Worker
returns a sleep duration and the Board obeys it. This keeps timezone and DST handling,
Refresh Window changes, and school-year quirks on the side of the system that can be
fixed with `git push` rather than a USB cable.

It also means **staleness can only be detected server-side**. A Frame that downloads
successfully but was rendered three days ago is indistinguishable from a fresh one to
a device with no clock, so the Worker marks stale Frames before serving them, and the
rendered date in the top bar is the visible tell. The Board's own failure handling
covers only the case it can actually observe: not reaching the Worker at all.

The cost is that the Board cannot degrade gracefully on its own. With no local
rendering, a Worker outage means the last Frame stays on the wall indefinitely — which
is why the stored Frame is never overwritten by a failed render, and why the date is
non-negotiable.
