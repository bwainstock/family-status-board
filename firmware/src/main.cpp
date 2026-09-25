// Hardware bring-up spike — issue #13.
//
// This is not the Board's firmware. It answers the four questions that have to
// be settled before a layout is built on top of them, and it answers them
// offline, because mixing them up with "does WiFi work" would answer neither:
//
//   1. Is this panel the panel we think it is?
//   2. Does a set bit come out black, or is the image a photographic negative?
//   3. Does GxEPD2 put a 792-wide Frame on the glass without reintroducing the
//      dead-column gap between the two controllers?
//   4. Does a full refresh leave residue?
//
// It draws two Frames composed on the device: a coarse checkerboard, then the
// test pattern. Both go through the driver's image-writing path. Neither
// touches the controllers directly, and there is no network anywhere.
//
// What it finds goes in docs/hardware/bringup.md. The serial output below is a
// checklist to fill in while standing in front of the panel, not a result.

#include <Arduino.h>
#include <GxEPD2_BW.h>
#include <SPI.h>

#include "board_pins.h"
#include "bringup.h"
#include "frame.h"
#include "panel_probe.h"

// GxEPD2 speaks the controllers' own RAM convention, in which a *set* bit is
// white — its blank screen is 0xFF. A Frame is the opposite (ADR 0002: a set
// bit is black), because that is the sane way round for the Worker to compose
// and for a golden fixture to read.
//
// This flag is the whole polarity escape hatch. If the panel comes out as a
// negative, it flips, and nothing else moves: not the Worker, not the byte
// contract, not the goldens. Inverting on the Worker's side instead would mean
// changing what goes over the wire, which is the one thing ADR 0002 pins down.
static constexpr bool kInvertForPanel = true;

// A whole Frame, in internal SRAM. 26,928 bytes of a 512 KB budget, and the
// same buffer the real firmware will download into.
static uint8_t g_frame[frame::kBytes];

static GxEPD2_579_GDEY0579T93 g_panel(pins::kEpdCs, pins::kEpdDc, pins::kEpdRst,
                                      pins::kEpdBusy);

// The ladder. Each rung asks one question, and the first rung that looks wrong
// says where the fault is: the uniform fills use nothing but the driver's own
// clear path, so if they are wrong the Frame is not the suspect.
//
// The last rungs repeat the same questions through raw controller access
// instead of GxEPD2. That comparison is the only way to separate "the library
// mishandles this panel" from "this panel is faulty", and the first run of the
// ladder made it necessary: GxEPD2 refreshed one controller's half and left the
// other frozen on whatever it happened to be showing.
enum class Path {
  kDriverFill,   // GxEPD2's own clearScreen
  kDriverFrame,  // GxEPD2's image path, the one the real firmware will use
  kProbeFill,    // raw controller access, flooding both controllers
  kProbeFrame,   // raw controller access, carrying a Frame
  kColdStart,    // cut the panel rail, then raw access from scratch
};

struct Stage {
  const char* name;
  const char* expect;
  Path path;
  void (*compose)(uint8_t*);
  uint8_t fill;        // controller RAM, where a set bit is white
  uint8_t slave_fill;  // the same, for the second controller
};

static const Stage kStages[] = {
    {"all white", "a uniform white panel, no marks anywhere", Path::kDriverFill,
     nullptr, 0xFF, 0xFF},
    {"all black", "a uniform black panel, edge to edge, no streaks",
     Path::kDriverFill, nullptr, 0x00, 0x00},
    {"left half", "left half black, right half white, split down the middle",
     Path::kDriverFrame, bringup::left_half, 0, 0},
    {"top half", "top half black, bottom half white", Path::kDriverFrame,
     bringup::top_half, 0, 0},
    {"corner blocks", "1 block top-left, 2 top-right, 3 bottom-left, 4 bottom-right",
     Path::kDriverFrame, bringup::corner_blocks, 0, 0},
    {"ghost bait", "a coarse checkerboard of big blocks", Path::kDriverFrame,
     bringup::ghost_bait, 0, 0},
    {"test pattern", "the full pattern; compare with docs/hardware/bringup-pattern.png",
     Path::kDriverFrame, bringup::test_pattern, 0, 0},
    {"raw all white", "a uniform white panel, both halves", Path::kProbeFill,
     nullptr, 0xFF, 0xFF},
    {"raw all black", "a uniform black panel, both halves", Path::kProbeFill,
     nullptr, 0x00, 0x00},
    {"raw master black", "only the master's half black, the slave's white",
     Path::kProbeFill, nullptr, 0x00, 0xFF},
    {"raw slave black", "only the slave's half black, the master's white",
     Path::kProbeFill, nullptr, 0xFF, 0x00},
    {"raw corner blocks",
     "1 block top-left, 2 top-right, 3 bottom-left, 4 bottom-right",
     Path::kProbeFrame, bringup::corner_blocks, 0, 0},
    {"raw test pattern",
     "the full pattern; compare with docs/hardware/bringup-pattern.png",
     Path::kProbeFrame, bringup::test_pattern, 0, 0},
    {"cold start, all white",
     "a uniform white panel, both halves, after the rail has been cut",
     Path::kColdStart, nullptr, 0xFF, 0xFF},
    {"cold start, all black",
     "a uniform black panel, both halves, after the rail has been cut",
     Path::kColdStart, nullptr, 0x00, 0x00},
};
static constexpr int kStageCount = int(sizeof(kStages) / sizeof(kStages[0]));

// The two paths each reset the panel and leave it configured their own way, so
// crossing between them means re-initialising rather than trusting whatever the
// other one left behind.
static Path g_initialised_as = Path::kDriverFill;
static bool g_initialised = false;

static bool is_probe(Path path) {
  return path == Path::kProbeFill || path == Path::kProbeFrame ||
         path == Path::kColdStart;
}

// Drop the panel's supply long enough for its own reservoir to drain. A
// controller that has latched into a bad state will not be argued out of it by
// the reset pin; only a cold start clears it.
//
// Releasing the lines first is the whole point. CS, DC and RST idle HIGH and
// SCK/MOSI belong to the SPI peripheral, so cutting the rail underneath them
// leaves 3.3 V on the controllers' inputs, feeding them through their clamp
// diodes — which is exactly how a power cycle ends up not being one.
static void cycle_panel_power() {
  SPI.end();
  pinMode(pins::kEpdCs, INPUT);
  pinMode(pins::kEpdDc, INPUT);
  pinMode(pins::kEpdRst, INPUT);
  pinMode(pins::kEpdSck, INPUT);
  pinMode(pins::kEpdMosi, INPUT);

  digitalWrite(pins::kPanelPower, LOW);
  delay(2000);
  digitalWrite(pins::kPanelPower, HIGH);
  delay(200);

  SPI.begin(pins::kEpdSck, -1, pins::kEpdMosi, pins::kEpdCs);
}

static void ensure_initialised(Path path) {
  if (path == Path::kColdStart) {
    cycle_panel_power();
    panel_probe::init();
    g_initialised_as = path;
    g_initialised = true;
    return;
  }
  if (g_initialised && is_probe(g_initialised_as) == is_probe(path)) return;
  if (is_probe(path)) {
    panel_probe::init();
  } else {
    g_panel.init(115200, true, 10, false);
  }
  g_initialised_as = path;
  g_initialised = true;
}

static void run_stage(int index) {
  const Stage& stage = kStages[index];
  Serial.println();
  Serial.printf("[%c] %s\n", 'a' + index, stage.name);
  Serial.printf("       expect: %s\n", stage.expect);

  const uint32_t started = millis();
  ensure_initialised(stage.path);
  switch (stage.path) {
    case Path::kDriverFill:
      g_panel.clearScreen(stage.fill);
      break;
    case Path::kDriverFrame:
      stage.compose(g_frame);
      // writeImageForFullRefresh loads both the current and the previous
      // controller buffers, which is what makes the following refresh a genuine
      // full refresh rather than a differential one dressed up as one.
      g_panel.writeImageForFullRefresh(g_frame, 0, 0, frame::kWidth, frame::kHeight,
                                       kInvertForPanel);
      g_panel.refresh(false);
      break;
    case Path::kProbeFill:
    case Path::kColdStart:
      panel_probe::fill(stage.fill, stage.slave_fill);
      panel_probe::update();
      break;
    case Path::kProbeFrame:
      stage.compose(g_frame);
      panel_probe::draw(g_frame);
      panel_probe::update();
      break;
  }
  Serial.printf("       drawn in %lu ms. Send a letter to jump, anything else steps.\n",
                static_cast<unsigned long>(millis() - started));
}

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println();
  Serial.println("Board bring-up spike (issue #13)");
  Serial.printf("  frame          %u x %u, %u bytes\n", unsigned(frame::kWidth),
                unsigned(frame::kHeight), unsigned(frame::kBytes));
  Serial.printf("  driver         GxEPD2_579_GDEY0579T93, %u x %u\n",
                unsigned(GxEPD2_579_GDEY0579T93::WIDTH),
                unsigned(GxEPD2_579_GDEY0579T93::HEIGHT));
  Serial.printf("  set bit is     %s\n", kInvertForPanel ? "black" : "white");
  Serial.println();
  Serial.println("Stepping through a ladder of Frames. The first one that looks");
  Serial.println("wrong is the one that matters; everything after it is noise.");

  // Cut the panel's rail before anything else touches it. At this point CS, DC
  // and RST are still inputs from reset, so nothing is driving the controllers
  // while their supply is down and the power cycle is a real one. A stuck BUSY
  // survives a reset pulse; it does not survive this.
  pinMode(pins::kPanelPower, OUTPUT);
  digitalWrite(pins::kPanelPower, LOW);
  delay(500);
  digitalWrite(pins::kPanelPower, HIGH);
  delay(100);

  pinMode(pins::kKeyHome, INPUT_PULLUP);

  SPI.begin(pins::kEpdSck, -1, pins::kEpdMosi, pins::kEpdCs);
  g_panel.selectSPI(SPI, SPISettings(10000000, MSBFIRST, SPI_MODE0));

  // No init() here: each rung initialises the path it needs, because the two
  // paths configure the controllers differently and neither survives the other.
  run_stage(0);
}

void loop() {
  static int stage = 0;
  static uint32_t shown_at = millis();

  // Stepped by hand or over the wire. The useful question is "which rung
  // broke", and answering it needs something looking at the glass — a person,
  // or a camera being driven from the other end of this serial port. A letter
  // jumps straight to that rung; anything else advances. The timeout only
  // exists so a dead button cannot strand the ladder on its first step.
  int requested = -1;
  bool stepped = false;
  while (Serial.available() > 0) {
    const int byte = Serial.read();
    if (byte >= 'a' && byte < 'a' + kStageCount) requested = byte - 'a';
    stepped = true;
  }

  const bool pressed = digitalRead(pins::kKeyHome) == LOW;
  const bool waited = millis() - shown_at > 300000;
  if (!pressed && !stepped && !waited) {
    delay(20);
    return;
  }

  if (requested >= 0) {
    stage = requested;
  } else {
    stage++;
  }

  if (stage >= kStageCount) {
    stage = 0;
    Serial.println();
    Serial.println("Back to the top of the ladder.");
  }

  run_stage(stage);
  shown_at = millis();
  delay(300);  // crude debounce; the button is a human, not a signal source
}
