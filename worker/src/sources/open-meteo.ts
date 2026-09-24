/**
 * Open-Meteo. No key, no account, and it resolves days in whatever timezone
 * you ask for — which is the only reason `daily.time` can be matched against a
 * local calendar date at all.
 *
 * Two days are requested, not one: the fourth cell falls back to tomorrow's
 * weather when there is nothing worth counting Sleeps toward.
 */

import { SCHOOL_TIMEZONE } from "../day/clock.js";
import type { OpenMeteoForecast } from "../day/weather.js";
import { fetchJson } from "./fetch.js";

/** Rose Garden, San Jose CA. */
export const SCHOOL_LATITUDE = 37.3305;
export const SCHOOL_LONGITUDE = -121.9236;

export function forecastUrl(latitude = SCHOOL_LATITUDE, longitude = SCHOOL_LONGITUDE): string {
  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "wind_speed_10m_max",
    ].join(","),
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: SCHOOL_TIMEZONE,
    forecast_days: "2",
  });
  return `https://api.open-meteo.com/v1/forecast?${query.toString()}`;
}

export function fetchForecast(latitude?: number, longitude?: number): Promise<OpenMeteoForecast | null> {
  return fetchJson<OpenMeteoForecast>(forecastUrl(latitude, longitude), "open-meteo");
}
