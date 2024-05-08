import { Dayjs } from 'dayjs';

import { DEFAULT_TIMEZONE, dayjs } from '../internals/dates';

const STARTING_HOURS = 10;
const ENDING_HOURS = 18;

const clampMinutes = (minute: number) => {
  switch (true) {
    case minute < 10:
      return 0;
    case minute <= 15:
      return 15;
    case minute <= 30:
      return 30;
    case minute <= 45:
      return 45;
    default:
      return 60;
  }
};

export const getMinimumPickupTimeForDate = (date: Dayjs): Dayjs | null => {
  const diffLength = date
    .clone()
    .startOf('day')
    .diff(dayjs().tz(DEFAULT_TIMEZONE).startOf('day'), 'day');

  if (diffLength < 0) {
    return null;
  } else if (diffLength === 0) {
    const now = dayjs().tz(DEFAULT_TIMEZONE);
    const minutesNow = now.get('minute');
    const hourNow = now.get('hour');
    const minimumAllowedHour = Math.min(
      ENDING_HOURS + 1,
      Math.max(STARTING_HOURS, hourNow + 2)
    );

    if (minimumAllowedHour > ENDING_HOURS) {
      return null;
    }

    return date
      .set('hour', minimumAllowedHour)
      .set(
        'minute',
        hourNow < STARTING_HOURS - 2 ? 0 : clampMinutes(minutesNow)
      );
  } else {
    return date.set('hour', STARTING_HOURS).set('minute', 0);
  }
};
