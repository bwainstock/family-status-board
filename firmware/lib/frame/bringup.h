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
// if they are right but the halves are not, the fault is in how a Frame is
// mapped onto the two controllers.

// Left half black, right half white, split exactly on the seam. The bluntest
// possible question about the x axis and about whether both controllers are
// being addressed at all.
void left_half(uint8_t* bytes);

// Top half black, bottom half white: the same question about the y axis, and
// about GxEPD2's horizontal split between the controllers' upper and lower
// quadrants.
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

// A rule from edge to edge. A driver that inserts the controllers' dead columns
// breaks it at the seam; one that drops the last column shortens it.
constexpr int16_t kRuleY = 130;
constexpr int16_t kRuleH = 4;

// A wedge pointing down at the seam, so the checklist can say "look here".
constexpr int16_t kWedgeY = 136;
constexpr int16_t kWedgeH = 10;

// One-pixel vertical lines either side of the seam, with a line landing exactly
// on it. A column inserted or dropped at the seam doubles a line or opens a gap.
constexpr int16_t kGratingHalfWidth = 50;
constexpr int16_t kGratingY = 150;
constexpr int16_t kGratingH = 56;

// A solid block straddling the seam. A dead-column gap cuts a white stripe
// through the middle of it, which is the loudest signal on the panel.
constexpr int16_t kSeamBlockHalfWidth = 40;
constexpr int16_t kSeamBlockY = 210;
constexpr int16_t kSeamBlockH = 30;

// Ghost bait: 8 blocks across by 4 down, which divides 792 x 272 exactly.
constexpr int16_t kBaitCols = 8;
constexpr int16_t kBaitRows = 4;
constexpr int16_t kBaitW = frame::kWidth / kBaitCols;   // 99
constexpr int16_t kBaitH = frame::kHeight / kBaitRows;  // 68

// Corner blocks: big enough to survive glare and a hand-held photograph.
constexpr int16_t kBlockSize = 56;
constexpr int16_t kBlockGap = 16;
constexpr int16_t kBlockInset = 20;

}  // namespace layout

}  // namespace bringup

#endif  // BRINGUP_H_
