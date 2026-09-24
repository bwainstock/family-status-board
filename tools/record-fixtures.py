#!/usr/bin/env python3
"""
Re-record the upstream fixtures the Worker's tests run against.

The tests assert against real payloads rather than hand-written ones, because
every interesting bug in these two sources is a shape the documentation does
not mention: MealViewer answering 200 with nothing in it, an empty menuBlocks
array meaning two completely different things, a closure arriving as a food
item with a null type. A hand-written fixture only ever contains the shapes we
already thought of.

Fixtures are recorded verbatim apart from one trim, described below, and the
URL each came from is written into the file. Re-record with:

    python3 tools/record-fixtures.py

Note that MealViewer only publishes about five weeks ahead, so the dates below
go stale. When they do, pick new ones that exhibit the same four situations and
update DATES — the point is the shapes, not the particular lunches.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.request
from pathlib import Path

FIXTURES = Path(__file__).resolve().parent.parent / "worker" / "test" / "fixtures"

MEALVIEWER_SLUG = "SJUSDElementarySchoolsSJUSD"
MEALVIEWER = "https://api.mealviewer.com/api/v4/school/{slug}/{date}/{date}"

# Rose Garden, San Jose CA, resolved in the school's own timezone so that
# daily[] is indexed by local calendar date and not by UTC.
OPEN_METEO = (
    "https://api.open-meteo.com/v1/forecast"
    "?latitude={lat}&longitude={lon}"
    "&daily=weather_code,temperature_2m_max,temperature_2m_min"
    ",precipitation_probability_max,wind_speed_10m_max"
    "&temperature_unit=fahrenheit&wind_speed_unit=mph"
    "&timezone=America%2FLos_Angeles&forecast_days=2"
)

MEALVIEWER_CASES = {
    # A normal school day: two blocks, the Lunch block's first ENTREES item is
    # the hot main.
    "mealviewer-normal": "09-24-2026",
    # A weekday the school is shut. Not an empty response — a normal block
    # holding one sentinel item called "NO SCHOOL!" with a null item_Type.
    "mealviewer-no-school": "09-28-2026",
    # A Saturday. menuBlocks is empty, which is exactly what an unpublished
    # weekday looks like too. This is why emptiness must never be read as a
    # closure.
    "mealviewer-empty": "09-26-2026",
    # Beyond the publishing horizon. Also an empty menuBlocks, on a date that
    # is definitely a school day.
    "mealviewer-unpublished": "12-10-2026",
}

WEATHER_CASES = {
    # The school's own location.
    "open-meteo-clear": (37.3305, -121.9236),
    # Somewhere actually wet, recorded so the rain path is exercised against a
    # real payload rather than an invented one.
    "open-meteo-rain": (47.6062, -122.3321),
}


def get(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=30) as response:
        if response.status != 200:
            raise SystemExit(f"{url} answered {response.status}")
        return json.load(response)


def trim_mealviewer(payload: dict) -> dict:
    """
    Drop the per-item nutrition and allergen tables, and the duplicate
    `dailyMenus` view of the same menu.

    Nothing the Worker reads lives in either, and together they are ~95% of a
    120KB response. Everything the parser can see is kept exactly as it
    arrived, including the fields it ignores.
    """
    for schedule in payload.get("menuSchedules", []):
        for block in schedule.get("menuBlocks", []):
            for line in block.get("cafeteriaLineList", {}).get("data", []):
                for item in line.get("foodItemList", {}).get("data", []):
                    item.pop("nutritionals", None)
                    item.pop("allergens", None)
    payload.pop("dailyMenus", None)
    payload.pop("physicalLocationNutritionals", None)
    payload.pop("physicalLocationAllergens", None)
    return payload


def write(name: str, url: str, payload: dict, note: str) -> None:
    path = FIXTURES / f"{name}.json"
    document = {"_recordedFrom": url, "_note": note, "payload": payload}
    path.write_text(json.dumps(document, indent=2) + "\n", encoding="utf-8")
    print(f"  {path.name}  {path.stat().st_size // 1024} KB")


def record_parentsquare() -> None:
    """
    The ParentSquare feed, recorded as text rather than JSON.

    The subscription URL authenticates by being unguessable, so it lives in
    worker/.dev.vars and is never written into the fixture. The recorded body
    carries no user identifier of its own -- only event UIDs and the school
    name -- which is what makes it safe to check in.

    This one matters more than the others. The feed carries adult health
    content that reaches a child's wall unless the allowlist holds, and the
    only honest test of that is the real list of event names.
    """
    url = os.environ.get("PARENTSQUARE_ICS_URL") or dev_vars().get("PARENTSQUARE_ICS_URL")
    if not url:
        print("  skipped: set PARENTSQUARE_ICS_URL in worker/.dev.vars")
        return

    with urllib.request.urlopen(url.replace("webcal://", "https://"), timeout=30) as response:
        body = response.read().decode("utf-8")

    path = FIXTURES / "parentsquare.ics"
    path.write_text(
        "# Recorded from the ParentSquare subscription URL held in\n"
        "# worker/.dev.vars as PARENTSQUARE_ICS_URL. The URL is a credential\n"
        "# and is deliberately not recorded here. Verbatim below this line.\n" + body,
        encoding="utf-8",
    )
    print(f"  {path.name}  {path.stat().st_size // 1024} KB")


def dev_vars() -> dict[str, str]:
    path = Path(__file__).resolve().parent.parent / "worker" / ".dev.vars"
    if not path.exists():
        return {}
    values = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def main() -> int:
    FIXTURES.mkdir(parents=True, exist_ok=True)
    print("MealViewer")
    for name, date in MEALVIEWER_CASES.items():
        url = MEALVIEWER.format(slug=MEALVIEWER_SLUG, date=date)
        write(name, url, trim_mealviewer(get(url)), "nutritionals, allergens and dailyMenus removed")

    print("Open-Meteo")
    for name, (lat, lon) in WEATHER_CASES.items():
        url = OPEN_METEO.format(lat=lat, lon=lon)
        write(name, url, get(url), "verbatim")

    print("ParentSquare")
    record_parentsquare()

    return 0


if __name__ == "__main__":
    sys.exit(main())
