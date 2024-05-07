import { Dayjs } from 'dayjs';

import { dayjs } from '../internals/dates';

const STARTING_HOURS = 10;
const ENDING_HOURS = 18;

const unifyDate = (date: Date | Dayjs) =>
  date instanceof Date ? dayjs(date) : date;

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

export const getMinimumPickupTimeForDate = (
  date: Date | Dayjs
): Date | null => {
  const dateAsDayJs = unifyDate(date);
  const diffLength = dateAsDayJs
    .clone()
    .startOf('day')
    .diff(dayjs().startOf('day'), 'day');

  if (diffLength < 0) {
    return null;
  } else if (diffLength === 0) {
    const now = dayjs();
    const minutesNow = now.get('minute');
    const hourNow = now.get('hour');
    const minimumAllowedHour = Math.min(
      ENDING_HOURS + 1,
      Math.max(STARTING_HOURS, hourNow + 2)
    );

    if (minimumAllowedHour > ENDING_HOURS) {
      return null;
    }

    return dateAsDayJs
      .set('hour', minimumAllowedHour)
      .set(
        'minute',
        hourNow < STARTING_HOURS - 2 ? 0 : clampMinutes(minutesNow)
      )
      .toDate();
  } else {
    return dateAsDayJs.set('hour', STARTING_HOURS).set('minute', 0).toDate();
  }
};
