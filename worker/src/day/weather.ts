/**
 * Today's weather, as something to wear.
 *
 * The Viewer cannot read "light drizzle", and would not act differently if she
 * could. What she needs is: coat, hat, sunglasses, or nothing special. So the
 * mapping below throws away most of what Open-Meteo says and keeps the part
 * that changes what happens at the front door.
 *
 * Nothing here fetches. It is handed an already-parsed payload so that the
 * tests can run the real recorded responses through it without a network.
 */

import type { WeatherFact, WeatherGlyph } from "./model.js";

/** The shape of the fields we ask Open-Meteo for. Everything is optional
 *  because a malformed answer must produce an absent fact, not an exception. */
export interface OpenMeteoForecast {
  readonly daily?: {
    readonly time?: readonly string[];
    readonly weather_code?: readonly number[];
    readonly temperature_2m_max?: readonly number[];
    readonly precipitation_probability_max?: readonly (number | null)[];
    readonly wind_speed_10m_max?: readonly number[];
  };
}

/**
 * A cloudy day with this much chance of rain is a rainy day as far as the
 * front door is concerned. This is the "technically cloudy" case: the WMO code
 * describes the sky, not whether she gets wet on the walk home.
 */
export const RAIN_PROBABILITY_PERCENT = 50;

/** Judgement calls for this particular valley, not universal truths. */
export const HOT_F = 90;
export const COLD_F = 52;
export const WINDY_MPH = 24;

// WMO weather interpretation codes. Grouped by what they mean for a coat.
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const OVERCAST_CODES = new Set([3, 45, 48]);
const PARTLY_CLOUDY_CODES = new Set([1, 2]);

export interface Conditions {
  readonly code: number;
  readonly highF: number;
  readonly rainProbability: number;
  readonly windMph: number;
}

/**
 * The order matters and is the whole design.
 *
 * Rain first, because being caught in it is the failure that actually ruins a
 * walk to school, and because a rainy day is very often also a cloudy one —
 * see the acceptance criteria. Temperature next, because a coat is the second
 * decision. Wind last, because it only changes what to wear when nothing else
 * already has. The sky itself is what is left over.
 */
export function whatToWear(conditions: Conditions): WeatherGlyph {
  const { code, highF, rainProbability, windMph } = conditions;

  if (RAIN_CODES.has(code) || rainProbability >= RAIN_PROBABILITY_PERCENT) return "rain";
  if (SNOW_CODES.has(code)) return "snow";
  if (highF >= HOT_F) return "hot";
  if (highF <= COLD_F) return "cold";
  if (windMph >= WINDY_MPH) return "wind";
  if (OVERCAST_CODES.has(code)) return "cloud";
  if (PARTLY_CLOUDY_CODES.has(code)) return "partly-cloudy";
  return "sun";
}

/**
 * Pull one local calendar date out of a forecast.
 *
 * Returns null for anything unexpected — a missing date, a short array, a
 * non-numeric temperature. A missing weather fact draws a question mark, which
 * is honest; a confident wrong one is not.
 */
export function weatherFor(forecast: OpenMeteoForecast | null, date: string): WeatherFact | null {
  const conditions = conditionsFor(forecast, date);
  if (conditions === null) return null;
  return { glyph: whatToWear(conditions), tempF: Math.round(conditions.highF) };
}

export function conditionsFor(forecast: OpenMeteoForecast | null, date: string): Conditions | null {
  const daily = forecast?.daily;
  if (daily === undefined) return null;

  const index = daily.time?.indexOf(date) ?? -1;
  if (index < 0) return null;

  const code = daily.weather_code?.[index];
  const highF = daily.temperature_2m_max?.[index];
  if (!isFiniteNumber(code) || !isFiniteNumber(highF)) return null;

  // Open-Meteo sends null for these beyond its confident horizon. Absent is
  // not the same as zero for temperature, but it is close enough for "is it
  // going to rain" and "is it going to blow".
  const rainProbability = daily.precipitation_probability_max?.[index];
  const windMph = daily.wind_speed_10m_max?.[index];

  return {
    code,
    highF,
    rainProbability: isFiniteNumber(rainProbability) ? rainProbability : 0,
    windMph: isFiniteNumber(windMph) ? windMph : 0,
  };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
