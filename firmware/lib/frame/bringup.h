// The hardware bring-up spike's two Frames — issue #13.
//
// Both are composed locally, on the Board, from nothing. No network is
// involved: the question these answer is whether the panel is the panel we
// think it is and whether a Frame lands on it the right way round, and mixing
// that up with whether WiFi works would answer neither.

#ifndef BRINGUP_H_
#define BRINGUP_H_

#include <stdint.h>

#include "frame.h"

namespace bringup {

// A ladder of Frames, from "can this panel be driven at all" up to the full
// test pattern. Walked one step at a time so that a failure names its own
// cause: if the uniform fills are wrong the driver or the panel is wrong, and
// if they are right but the halves are not, the fault is in how a Frame's
// axes are mapped onto the glass. On the previous two-controller panel this
// was also where a bad master/slave mapping would show up; the GDEY075T7 has
// only the one controller, but orientation is still worth asking about on its
// own.

// Left half black, right half white, split exactly at the panel's centre. The
// bluntest possible question about the x axis: is a Frame's width mapped onto
// the glass at all, and which way round. On the previous panel this line also
// marked the seam between the two SSD1683 halves; the GDEY075T7 has no seam,
// so this rung now only answers the orientation question.
void left_half(uint8_t* bytes);

// Top half black, bottom half white: the same question about the y axis.
void top_half(uint8_t* bytes);

// One block top-left, two top-right, three bottom-left, four bottom-right —
// the same count as the test pattern's pips, but large enough to read on a
// glossy panel under room lights, where a 14-pixel square is not.
void corner_blocks(uint8_t* bytes);

// Pass one. A coarse checkerboard of large blocks, drawn and fully refreshed
// before the test pattern. Every block it inks is left mostly white by
// test_pattern(), so any charge the panel fails to clear shows up as a visible
// grey grid underneath pass two. A ghosting test needs something to ghost.
void ghost_bait(uint8_t* bytes);

// Pass two. The Frame a human actually reads, against the checklist in
// docs/hardware/bringup.md. Mostly white by a wide margin, so an inverted
// panel is obvious from across the room rather than a judgement call.
void test_pattern(uint8_t* bytes);

// Geometry the checklist and the tests both refer to. Named rather than
// repeated so that moving a mark cannot silently move the thing that checks it.
namespace layout {

constexpr int16_t kBorderWeight = 2;

// One pip top-left, two top-right, three bottom-left, four bottom-right. Reads
// as 1-2-3-4 only in the correct orientation: a horizontal mirror gives
// 2-1-4-3, a vertical one 3-4-1-2, and 180 degrees 4-3-2-1. The four corners
// are also one per GxEPD2 controller quadrant, so this doubles as proof that
// all four quadrants were written.
constexpr int16_t kPipSize = 14;
constexpr int16_t kPipGap = 8;
constexpr int16_t kPipInset = 12;

// A solid block beside a hollow ring. Together with a white field they make
// polarity a three-way check rather than a guess.
constexpr int16_t kPolarityX = 12;
constexpr int16_t kPolarityY = 44;
constexpr int16_t kPolaritySize = 48;
constexpr int16_t kRingX = 72;
constexpr int16_t kRingWeight = 4;

// Two stacked bars sharing a byte boundary at x = 136 (byte 17). The lower one
// clears the high nibble, so it should start 4 pixels to the right of the upper
// one and end flush with it. Reverse the bit order and the step flips sides.
constexpr int16_t kNibbleX = 136;          // a multiple of 8, on purpose
constexpr int16_t kNibbleW = 64;
constexpr int16_t kByteBarY = 44;
constexpr int16_t kByteBarH = 24;
constexpr int16_t kNibbleBarY = 72;
constexpr int16_t kNibbleBarH = 24;
constexpr int16_t kNibbleInset = 4;

// A shallow ramp: 336 pixels across for 24 down, so it steps once every 14
// pixels. Smooth means the bit order is right; a sawtooth with 8-pixel teeth
// means it is not. Drawn two pixels thick to be visible on the glass.
constexpr int16_t kRampX0 = 216;
constexpr int16_t kRampY0 = 100;
constexpr int16_t kRampX1 = 552;
constexpr int16_t kRampY1 = 124;
constexpr int16_t kRampWeight = 2;

// A rule from edge to edge. A driver that silently truncates or duplicates a
// column anywhere along the row shows up as a shortened or doubled line.
constexpr int16_t kRuleY = 130;
constexpr int16_t kRuleH = 4;

// Alternating single-pixel columns. A driver that drops, duplicates, or bleeds
// a column between neighbours shows up here as a closed gap or a doubled
// line — a fault a solid fill can hide, because a solid fill has nothing
// adjacent for a bled or dropped column to disagree with. On the previous
// panel this sat on the seam between the two SSD1683s, which was as good a
// place as any to put it; the GDEY075T7 has no seam, so kCenterX here is just
// a convenient landmark, not a hazard being probed for.
constexpr int16_t kGratingHalfWidth = 50;
constexpr int16_t kGratingY = 150;
constexpr int16_t kGratingH = 56;

// A one-pixel line at the panel's horizontal centre, below the grating. The
// previous two-controller panel needed a wedge here and a solid block below
// that, alongside the grating above, to prove its dead-column gap had not
// leaked into the buffer; the GDEY075T7 is a single UC8179 with no such gap to
// prove absent, so this line is kept only as a centring reference, to be
// checked against the middle of the panel by eye. (The committed
// docs/hardware/bringup-pattern.png predates this rung and is 792x272 with the
// old wedge/grating/seam-block marks — re-render it with render_pattern
// before trusting it as a reference for this pattern.)
constexpr int16_t kCenterLineY = 210;
constexpr int16_t kCenterLineH = 30;

// Ghost bait: 8 blocks across by 4 down, which divides 800 x 480 exactly.
constexpr int16_t kBaitCols = 8;
constexpr int16_t kBaitRows = 4;
constexpr int16_t kBaitW = frame::kWidth / kBaitCols;   // 100
constexpr int16_t kBaitH = frame::kHeight / kBaitRows;  // 120

// Corner blocks: big enough to survive glare and a hand-held photograph.
constexpr int16_t kBlockSize = 56;
constexpr int16_t kBlockGap = 16;
constexpr int16_t kBlockInset = 20;

}  // namespace layout

}  // namespace bringup

#endif  // BRINGUP_H_
