# Firmware

The Board's firmware: an ESP32-S3 that wakes, draws a Frame on the e-paper panel, and
goes back to sleep. Right now it is only the bring-up spike for issue #13 — see
[docs/hardware/bringup.md](../docs/hardware/bringup.md) for what the panel actually did,
including the dead controller you will notice within seconds of powering it on.

## Layout

```
lib/frame/      the pure core: Frame bytes and the bring-up patterns. No Arduino.
test/           host tests for that core
src/            the hardware shell: panel, SPI, buttons
include/        the board's pin map
tools/          host-side helpers that link the same core the firmware does
```

The split is the point. `lib/frame` compiles on a laptop with no toolchain and no board,
so the geometry of what gets drawn is settled by tests rather than by squinting at
e-paper. `src/` is kept thin enough that there is not much left to be wrong in it.

## Working on it

Tests first — they need nothing but a C++ compiler:

```sh
pio test -e native
```

Build and flash. The upload port is a glob in `platformio.ini`, which picks the USB
serial adapter and avoids the Bluetooth port macOS also advertises:

```sh
pio run -e board
pio run -e board -t upload
```

Watch the serial output:

```sh
pio device monitor -e board
```

## The bring-up ladder

`src/main.cpp` is a ladder of test Frames, coarsest first. Each rung asks one question,
so the first rung that looks wrong is the one that matters and everything after it is
noise. Step with the HOME button, or send a rung's letter over the serial port:

| | |
|---|---|
| `a`–`b` | uniform white, uniform black, via GxEPD2's own clear path |
| `c`–`e` | half-and-half and corner blocks: orientation and mirroring |
| `f`–`g` | ghost bait, then the full test pattern |
| `h`–`m` | the same questions through the vendor's raw SSD1683 sequence |
| `n`–`o` | uniform fills after cutting the panel's supply rail |

Rungs `h` onwards exist only to tell "GxEPD2 mishandles this panel" apart from "this
panel is broken". `src/vendor_probe.cpp` is a deliberate dead end: the firmware proper
goes through GxEPD2's image path, per issue #2.

## Rendering the patterns on a laptop

`tools/render_pattern.cpp` links the same `bringup.cpp` the firmware does and writes a
1-bit PNG, so the panel can be compared against an exact reference instead of a memory:

```sh
c++ -std=c++17 -Ilib/frame -o /tmp/render_pattern \
    tools/render_pattern.cpp lib/frame/frame.cpp lib/frame/bringup.cpp
/tmp/render_pattern pattern ../docs/hardware/bringup-pattern.png
/tmp/render_pattern bait ../docs/hardware/bringup-ghost-bait.png
```

## Two things not to re-derive

**A set bit is black.** ADR 0002 fixes the Frame's byte contract: row-major, MSB first,
100 bytes a row, set bit is ink. The controllers use the opposite convention, so the
firmware passes `kInvertForPanel = true` to GxEPD2 and nothing else moves. That flag is
the entire polarity escape hatch, and it lives here rather than in the Worker so that what
goes over the wire never changes.

**A Frame is the logical image, not the panel's own RAM layout.** The previous panel hid
8 columns where its two SSD1683 controllers met, and a Frame had to carry no trace of
that gap. The GDEY075T7 is a single UC8179 with no such gap — but the underlying rule
survives the hardware that prompted it: whatever a display driver's own RAM addressing
needs is the driver's job to own, never this buffer's.
