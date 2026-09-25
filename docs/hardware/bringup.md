# Bring-up: what the panel actually did

Issue #13. Everything below was measured on the board on the bench, not read off a
datasheet. Where a question could not be answered, it says so and says why.

**The headline: one of the panel's two controllers is dead.** The half that works is
correct in every respect we set out to check. The other half has never changed, under
any software we could point at it.

![One controller responding, one frozen](dead-controller.jpg)

Both halves were sent a solid black screen. The right half is what a working controller
does. The left half is what this panel has shown since the first power-on, and it is not
a rendering of anything — it is the same grey it was before, unchanged by roughly forty
refreshes. The streaking at the bottom of the photo is desk glare, not the panel.

## The board

CrowPanel ESP32 5.79" (Elecrow DIS08792E), ESP32-S3-WROOM-1-N8R8. The panel is 792x272
across **two cascaded SSD1683 controllers**, addressed over one SPI bus and one chip
select; the second controller is reached by setting bit 7 of the command byte, so the
master's black/white RAM is `0x24` and the slave's is `0xA4`. Pin map in
`firmware/include/board_pins.h`, every number cited to the vendor's own sources.

Each SSD1683 drives 400 source lines but only 396 reach glass, which is where the
dead-column gap comes from: 396 visible, 8 dead straddling the seam, 396 visible, 800
addressable in total. The vendor's own header says so in as many words
(`example/arduino/Demos/5.79_WIFI_refresh/EPD_Init.h`).

Measured timings, master controller, at 20 °C:

| | |
|---|---|
| Full refresh (`0x22` → `0xd7`, GxEPD2's fast waveform) | 1725 ms |
| Full refresh (`0x22` → `0xF7`, the vendor's conservative waveform) | 2120 ms |
| Frame composed, written and refreshed, end to end | 1900 ms |

Both are inside the 2200 ms the GDEY0579T93 datasheet budgets, so the panel is
electrically healthy and handshaking properly on BUSY. This is not a timing fault.

## The dead controller

The slave controller does not respond to anything. What was tried, in order, each one
ruling out a different explanation:

| Tried | Result |
|---|---|
| GxEPD2's `clearScreen` and image path | Master's half correct, slave's half frozen |
| The vendor's raw SSD1683 sequence (`firmware/src/vendor_probe.cpp`) | Identical failure |
| Master RAM black, slave RAM white | Master's half black; nothing else moved |
| Master RAM white, slave RAM black | Master's half white; nothing else moved |
| Panel rail cut for 2 s, then a cold init | Identical failure |

The third and fourth rows are the decisive ones. Writing the slave's RAM has **no visible
effect anywhere on the panel**, while writing the master's RAM drives its half exactly as
asked. The slave is not mis-addressed and it is not being overwritten; it is not there.

That rules out the two suspects worth ruling out. It is not a GxEPD2 bug, because the
vendor's own sequence — transcribed command for command, including its slower waveform,
its per-byte chip-select framing, and its decrementing scan direction for the slave —
fails the same way. And it is not a latched controller, because a genuine cold start with
the supply rail down does not clear it.

Two possibilities remain, neither of which is a software problem: the panel's FPC is not
fully seated on the second controller, or that controller is damaged. **Reseat the ribbon
before ordering a replacement.**

Until then, the seam is the one thing that cannot be checked, because checking it needs
both halves.

## What the working half settled

Everything the spike set out to learn, apart from the seam, was answerable on one
controller's half, and all of it came out in our favour.

**The panel is the panel we thought it was.** GxEPD2's `GxEPD2_579_GDEY0579T93` drives it
without modification, at the size we assumed, with refresh times matching the datasheet.

**A set bit is black, once inverted for the panel.** The controllers use the opposite
convention to ADR 0002 — their blank screen is `0xFF`, so a *set* bit is white. GxEPD2's
image path takes an `invert` argument, so this costs exactly one flag:

```cpp
static constexpr bool kInvertForPanel = true;
```

That flag lives in the firmware, deliberately. Inverting on the Worker's side would change
what goes over the wire, which is the one thing ADR 0002 pins down, and would invalidate
every golden fixture. Nothing about the byte contract moved.

**Orientation and mirroring are correct.** The `corner_blocks` Frame puts one block in the
top-left, two top-right, three bottom-left, four bottom-right. The working half is the
Frame's right half, and its two blocks appeared in the panel's top-right, read the normal
way up. No rotation, no mirroring, no flip.

**Bit order within a byte is right.** The blocks came out as clean rectangles with square
edges. Reversed bit order inside a byte turns every edge into an 8-pixel sawtooth, and
there is none.

**A full refresh leaves no ghosting.** Measured rather than eyeballed: a coarse
checkerboard was drawn, then a blank screen, and the panel was photographed before and
after. Mean luminance over a grid of cells across the working half:

```
before the checkerboard   120 121 121 122 122 123 123 123
the checkerboard            8  40 129 134  99  19  19  54
after, blank again        123 123 124 124 124 125 125 125
```

Cells that differed by 126 levels came back within 3 levels of each other, and that
residual is a lighting gradient present in the "before" capture too. One full refresh
clears the panel completely. No multi-pass clear is needed.

## The one that is still open

**The dead-column gap has not been checked**, and cannot be until both halves work. What
we know is the geometry — 396 visible, 8 dead, 396 visible — and one thing worth writing
down about GxEPD2 before anyone trusts it across the seam:

GxEPD2 splits the image at x=396, which is not a multiple of 8. `_setPartialRamArea`
rounds the RAM window out to whole bytes, giving each controller a 50-byte-wide window
(400 columns), but `_writeScreenBuffer` then writes only `396 * 272 / 8` bytes into it.
The window is 136 bytes larger than the data. Pixels either side of the seam are also
offset by 4 bits, because the visible image resumes mid-byte on the slave.

So there is reason to expect trouble at the seam specifically, and no reason yet to
expect it anywhere else. `vendor_probe::draw()` already handles the 4-bit offset properly
and can be used as a reference once there is a panel to compare against. If GxEPD2 turns
out to be wrong here, the fix belongs in the firmware's write path — ADR 0002 is explicit
that the Frame is the logical 792-wide image and must never carry the gap.

## Reproducing any of this

The spike is a ladder of test Frames in `firmware/src/main.cpp`, each asking one question,
stepped by the HOME button or by sending its letter over the serial port. The first rung
that looks wrong is the one that matters. Rungs `a`–`g` go through GxEPD2, `h`–`m` through
the vendor's raw sequence, `n`–`o` through a cold power cycle.

The Frames themselves are in `firmware/lib/frame/bringup.cpp` and are host-tested, so what
the panel is being asked to draw is never in question — see `firmware/README.md`.
`firmware/tools/render_pattern.cpp` renders the same Frames to PNG
(`bringup-pattern.png`, `bringup-ghost-bait.png`) so the glass can be compared against
something exact rather than against a memory.
