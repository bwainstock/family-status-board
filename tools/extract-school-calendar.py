#!/usr/bin/env python3
"""Derive the bedrock School Calendar from an SJUSD Student Calendar PDF.

    pip install pdfplumber
    python3 tools/extract-school-calendar.py 2026-2027SJUSDStudentCalendar.pdf

Why this exists: the PDF encodes school days only as *cell shading*, never as text.
Extracting the text layer gives you bare numbers with no indication of which are
holidays. So we work geometrically instead.

Two shading families matter:

  solid red    -> a regular student day
  pattern fill -> a shortened ("minimum") day; the sidebar says who it applies to

A weekday cell inside the school year with NEITHER fill is a Non-School Day.
That inversion is what makes this reliable: we never guess a holiday from a
formula, we read what the district actually shaded. SJUSD holds school on
Indigenous Peoples' Day and Cesar Chavez Day, so formulas would be wrong.

The one thing this cannot decide for you is whether a shortened-day block is for
elementary or secondary students; the PDF says that only in the sidebar prose.
Blocks are printed with their dates so you can match them against the sidebar by
hand. Trace is elementary: drop the secondary-only blocks.
"""

import calendar
import datetime
import json
import re
import sys

import pdfplumber

REGULAR_DAY_RED = (0.9647059, 0.2627451, 0.3294118)

MONTHS = {m: i for i, m in enumerate(calendar.month_name) if m}


def covered_by(word, rects):
    cx = (word["x0"] + word["x1"]) / 2
    cy = (word["top"] + word["bottom"]) / 2
    return any(
        r["x0"] - 1 <= cx <= r["x1"] + 1 and r["top"] - 1 <= cy <= r["bottom"] + 1
        for r in rects
    )


def find_month_blocks(words):
    """Locate each month grid by its '<Month> <year>' heading.

    The heading is two separate words in the text layer, so pair each month name
    with the year sitting immediately to its right on the same line.
    """
    years = [w for w in words if re.fullmatch(r"(19|20)\d{2}", w["text"])]
    blocks = []
    for w in words:
        if w["text"] not in MONTHS:
            continue
        same_line = [
            y
            for y in years
            if abs(y["top"] - w["top"]) < 4 and 0 <= y["x0"] - w["x1"] < 20
        ]
        if not same_line:
            continue
        blocks.append(
            {
                "year": int(min(same_line, key=lambda y: y["x0"])["text"]),
                "month": MONTHS[w["text"]],
                "x0": w["x0"] - 4,
                "x1": w["x0"] + 140,
                "top": w["top"],
            }
        )
    return blocks


def day_cells(block, digits):
    """Map day numbers in a month grid back to real dates.

    Grids show leading/trailing blanks, so we rebuild the 1..N run in reading
    order and stop at the first break. That discards stray digits from adjacent
    columns without needing pixel-perfect bounds.
    """
    n_days = calendar.monthrange(block["year"], block["month"])[1]
    in_block = [
        w
        for w in digits
        if block["x0"] <= w["x0"] <= block["x1"]
        and block["top"] + 12 <= w["top"] <= block["top"] + 112
    ]
    in_block.sort(key=lambda w: (round(w["top"]), w["x0"]))

    cells, expected = [], 1
    for w in in_block:
        value = int(w["text"])
        if value == expected and value <= n_days:
            cells.append((datetime.date(block["year"], block["month"], value), w))
            expected += 1
    return cells


def main(path):
    with pdfplumber.open(path) as pdf:
        page = pdf.pages[0]
        words = page.extract_words()
        digits = [w for w in words if w["text"].isdigit()]

        regular = [
            r for r in page.rects if r.get("non_stroking_color") == REGULAR_DAY_RED
        ]
        # pdfplumber cannot resolve pattern fills (/P1../P9) and reports them as 0.
        shortened = [
            r
            for r in page.rects
            if r.get("non_stroking_color") == 0
            and (r["x1"] - r["x0"]) > 5
            and (r["bottom"] - r["top"]) > 5
        ]

        blocks = sorted(find_month_blocks(words), key=lambda b: (b["year"], b["month"]))
        all_cells = []
        for block in blocks:
            all_cells.extend(day_cells(block, digits))
        all_cells.sort()

        # Bounds must consider shortened days too: the school year's last day is
        # itself a shortened day, so a red-only bound would truncate the final week.
        in_session = [
            d
            for d, w in all_cells
            if covered_by(w, regular) or covered_by(w, shortened)
        ]
        if not in_session:
            sys.exit("No regular-day fills found; the PDF's styling may have changed.")
        first_day, last_day = min(in_session), max(in_session)

        non_school, minimum = [], []
        for date, word in all_cells:
            if date.weekday() >= 5 or not (first_day <= date <= last_day):
                continue
            if covered_by(word, shortened):
                minimum.append(date)
            elif not covered_by(word, regular):
                non_school.append(date)

    print(f"First day: {first_day}   Last day: {last_day}")
    print(f"\nNon-School Days ({len(non_school)}) -- label these by hand:")
    for d in non_school:
        print(f"  {d}  {d:%a}")

    print(f"\nShortened-day cells ({len(minimum)}):")
    print("  Check each against the sidebar. REMOVE any marked 'Secondary schools'.")
    for d in minimum:
        print(f"  {d}  {d:%a}")

    print("\n--- JSON skeleton ---")
    print(
        json.dumps(
            {
                "schoolYear": f"{first_day.year}-{last_day.year}",
                "firstDay": str(first_day),
                "lastDay": str(last_day),
                "nonSchoolDays": {str(d): "TODO" for d in non_school},
                "minimumDays": {str(d): "Out 2 hours early" for d in minimum},
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
