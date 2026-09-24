# Frames are composed as a raw 1-bit framebuffer, not rasterised from SVG

The Worker builds each Frame by blitting pre-baked 1-bit glyph and icon bitmaps into a
26,928-byte buffer. It does not use satori, resvg, a headless browser, or any SVG or
HTML rasteriser. A future reader will expect the usual JSX-to-PNG pipeline and should
know it was rejected deliberately.

## Considered options

The Workers **Free** plan allows **10 ms of CPU per invocation**, and cron-triggered
handlers get exactly the same budget as HTTP requests. `satori` + `@resvg/resvg-wasm`
benchmarks at 50–90 ms, and WASM executes inside the isolate, so it counts in full.
That approach requires Workers Paid. Cloudflare Images and Browser Rendering both run
off-isolate and would fit the free tier, but both anti-alias their output.

## Consequences

Anti-aliasing is the deciding factor, not just cost. The panel is 1-bit, so any
greyscale intermediate has to be thresholded back to pure black and white, which
degrades exactly the small text and fine glyph detail the Board depends on. Composing
1-bit bitmaps directly produces hard pixels **by construction** — there is never a grey
pixel to destroy. The cheapest option is also the highest-quality one here.

The cost is that layout is manual pixel arithmetic with no flexbox, and every glyph must
be pre-rendered offline as a bitmap rather than authored as SVG at request time.

The byte format is fixed by the panel driver and is a hard contract with the firmware:
**row-major, top-left origin, MSB-first, 1 bpp, bit=1 meaning black, 792 as the width**
— 99 bytes per row times 272 rows. A committed golden fixture guards it from both sides,
because a polarity or bit-order mistake produces a garbled panel and no error anywhere.
