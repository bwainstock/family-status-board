/**
 * The Weather Cell's facts, run against real recorded Open-Meteo payloads.
 *
 * The derived answer is a what-to-wear decision, so each test below names the
 * morning it is trying to prevent.
 */

import { describe, expect, it } from "vitest";
import {
  COLD_F,
  HOT_F,
  RAIN_PROBABILITY_PERCENT,
  WINDY_MPH,
  conditionsFor,
  weatherFor,
  whatToWear,
  type Conditions,
  type OpenMeteoForecast,
} from "../src/day/weather.js";
import { forecastUrl } from "../src/sources/open-meteo.js";
import { fixture } from "./support/fixtures.js";

const clear = fixture<OpenMeteoForecast>("open-meteo-clear");
const rainy = fixture<OpenMeteoForecast>("open-meteo-rain");

function conditions(overrides: Partial<Conditions> = {}): Conditions {
  return { code: 0, highF: 70, rainProbability: 0, windMph: 5, ...overrides };
}

describe("the forecast request", () => {
  it("asks for the days in the school's own timezone", () => {
    // Without this, daily.time is indexed in UTC and every date lookup is off
    // by one for the first seventeen hours of the day.
    expect(forecastUrl()).toContain("timezone=America%2FLos_Angeles");
  });

  it("asks for two days, because the fourth cell falls back to tomorrow", () => {
    expect(forecastUrl()).toContain("forecast_days=2");
  });

  it("asks for Fahrenheit and mph, so nothing downstream converts anything", () => {
    expect(forecastUrl()).toContain("temperature_unit=fahrenheit");
    expect(forecastUrl()).toContain("wind_speed_unit=mph");
  });
});

describe("reading a recorded forecast", () => {
  it("finds today by local calendar date", () => {
    const today = conditionsFor(clear, "2026-09-24");
    expect(today).not.toBeNull();
    expect(today?.code).toBe(3);
    expect(today?.highF).toBeCloseTo(86.1, 1);
  });

  it("finds tomorrow too, which is what the countdown fallback needs", () => {
    expect(conditionsFor(clear, "2026-09-25")).not.toBeNull();
  });

  it("gives up on a date the forecast does not cover", () => {
    expect(weatherFor(clear, "2026-12-25")).toBeNull();
  });

  it("shows the temperature in whole degrees Fahrenheit", () => {
    // 86.1 on the wire; nobody wants a decimal point on a wall.
    expect(weatherFor(clear, "2026-09-24")?.tempF).toBe(86);
  });

  it("reads a real rainy day as rain", () => {
    // Recorded in Seattle: code 51 is "light drizzle", which is still a coat.
    expect(weatherFor(rainy, "2026-09-24")?.glyph).toBe("rain");
    expect(weatherFor(rainy, "2026-09-25")?.glyph).toBe("rain");
  });
});

describe("a source that failed or answered nonsense", () => {
  it.each([
    ["null", null],
    ["an empty object", {}],
    ["a forecast with no daily block", { daily: undefined }],
    ["arrays that do not line up", { daily: { time: ["2026-09-24"], weather_code: [] } }],
    ["a non-numeric temperature", { daily: { time: ["2026-09-24"], weather_code: [0], temperature_2m_max: [null] } }],
  ])("yields an absent fact rather than throwing, given %s", (_label, payload) => {
    expect(weatherFor(payload as OpenMeteoForecast | null, "2026-09-24")).toBeNull();
  });

  it("copes with the nulls Open-Meteo sends past its confident horizon", () => {
    const thin = {
      daily: {
        time: ["2026-09-24"],
        weather_code: [0],
        temperature_2m_max: [71.2],
        precipitation_probability_max: [null],
        wind_speed_10m_max: [],
      },
    };
    expect(weatherFor(thin, "2026-09-24")).toEqual({ glyph: "sun", tempF: 71 });
  });
});

describe("what to wear", () => {
  it("shows rain on a day that is only technically cloudy", () => {
    // Overcast code, high chance of rain. The code describes the sky; she
    // still gets wet on the walk home.
    expect(whatToWear(conditions({ code: 3, rainProbability: RAIN_PROBABILITY_PERCENT }))).toBe("rain");
  });

  it("lets rain beat every other condition", () => {
    expect(whatToWear(conditions({ code: 61, highF: HOT_F + 5 }))).toBe("rain");
    expect(whatToWear(conditions({ code: 61, highF: COLD_F - 5 }))).toBe("rain");
    expect(whatToWear(conditions({ code: 61, windMph: WINDY_MPH + 10 }))).toBe("rain");
    expect(whatToWear(conditions({ code: 3, rainProbability: 95, windMph: WINDY_MPH + 10 }))).toBe("rain");
  });

  it.each([51, 55, 61, 65, 80, 82, 95, 99])("treats WMO code %i as rain", (code) => {
    expect(whatToWear(conditions({ code }))).toBe("rain");
  });

  it.each([71, 75, 77, 85, 86])("treats WMO code %i as snow", (code) => {
    expect(whatToWear(conditions({ code }))).toBe("snow");
  });

  it("puts the temperature ahead of the sky, because a coat matters more", () => {
    expect(whatToWear(conditions({ code: 0, highF: HOT_F }))).toBe("hot");
    expect(whatToWear(conditions({ code: 0, highF: COLD_F }))).toBe("cold");
    // Overcast and cold is a hat, not a cloud.
    expect(whatToWear(conditions({ code: 3, highF: COLD_F - 10 }))).toBe("cold");
  });

  it("only mentions wind when nothing else has already decided the answer", () => {
    expect(whatToWear(conditions({ code: 0, windMph: WINDY_MPH }))).toBe("wind");
    expect(whatToWear(conditions({ code: 0, highF: HOT_F, windMph: WINDY_MPH }))).toBe("hot");
  });

  it("falls back to the sky when nothing needs saying", () => {
    expect(whatToWear(conditions({ code: 0 }))).toBe("sun");
    expect(whatToWear(conditions({ code: 1 }))).toBe("partly-cloudy");
    expect(whatToWear(conditions({ code: 2 }))).toBe("partly-cloudy");
    expect(whatToWear(conditions({ code: 3 }))).toBe("cloud");
    expect(whatToWear(conditions({ code: 45 }))).toBe("cloud");
  });

  it("calls an unheard-of code a sunny day rather than refusing to answer", () => {
    // WMO grows. A Glyph she can ignore beats a question mark on a fine day.
    expect(whatToWear(conditions({ code: 7 }))).toBe("sun");
  });
});
