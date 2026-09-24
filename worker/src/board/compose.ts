/**
 * Deciding what today looks like.
 *
 * One DayModel from every source, shared by the scheduled composition and the
 * preview route so that what is inspected in a browser is what ends up on the
 * wall.
 *
 * Every fetch here returns null rather than throwing, and every consumer
 * handles null, so a source being down costs one cell and not the Frame.
 */

import { addDays } from "../day/clock.js";
import { resolveSchool } from "../day/school.js";
import { SCHOOL_CALENDAR } from "../day/school-calendar.js";
import { weatherFor } from "../day/weather.js";
import { entreeFor } from "../day/entree.js";
import { allowedEvents } from "../day/events.js";
import { countdownFor } from "../day/countdown.js";
import { chargeReminderDue } from "../day/charge.js";
import { fetchForecast } from "../sources/open-meteo.js";
import { fetchMenu } from "../sources/mealviewer.js";
import { fetchEvents, eventsOf } from "../sources/parentsquare.js";
import type { DayModel, StatusFlag } from "../day/model.js";

export interface Sources {
  readonly PARENTSQUARE_ICS_URL?: string;
}

export async function composeDay(date: string, sources: Sources): Promise<DayModel> {
  const school = resolveSchool(date);

  // All three at once. They do not depend on each other, and the Board is
  // waiting on the slowest of them either way.
  const [forecast, menu, events] = await Promise.all([
    fetchForecast(),
    // No lunch to look up on a day there is no school.
    school.state.kind === "no-school" ? Promise.resolve(null) : fetchMenu(date),
    fetchEvents(sources.PARENTSQUARE_ICS_URL),
  ]);

  // Marks are for the Caregiver and describe the Board, not the day. Each one
  // is something a human has to go and do; nothing here changes a cell.
  const status: StatusFlag[] = [...school.flags];
  if (events.kind === "reauth-needed") status.push("reauth-needed");
  if (chargeReminderDue(date)) status.push("charge-reminder");

  return {
    date,
    weather: weatherFor(forecast, date),
    entree: entreeFor(menu, date),
    school: school.state,
    countdown: countdownFor(
      date,
      allowedEvents(eventsOf(events)),
      SCHOOL_CALENDAR,
      weatherFor(forecast, addDays(date, 1)),
    ),
    status,
  };
}
