/**
 * The charge reminder.
 *
 * The Board has no way to measure its own battery — there is no divider on the
 * cell and nothing on the panel to show a percentage to. So this is not a
 * measurement, it is a calendar: a mark that appears often enough that the
 * Board never runs flat, and rarely enough that the Caregiver still notices it.
 *
 * Monthly, because a device that wakes once a day and sleeps the rest of it
 * lasts weeks rather than days, and a nag that arrives weekly becomes wallpaper.
 */

const REMINDER_DAY = 1;

/**
 * Three days, not one.
 *
 * The reminder is only useful if it is seen, and the Board is not looked at
 * every single morning. One missed Refresh, one holiday, or one morning nobody
 * glanced up would otherwise skip a whole month.
 */
const REMINDER_DAYS = 3;

export function chargeReminderDue(isoDate: string): boolean {
  const day = Number(isoDate.slice(8, 10));
  return day >= REMINDER_DAY && day < REMINDER_DAY + REMINDER_DAYS;
}
