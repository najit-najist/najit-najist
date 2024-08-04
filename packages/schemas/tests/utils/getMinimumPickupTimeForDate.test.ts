import { describe, expect, it, vi } from 'vitest';

import { Dayjs, dayjs } from '../../src/internals/dates';
import { getMinimumPickupTimeForDate } from '../../src/utils/getMinimumPickupTimeForDate';

vi.useFakeTimers();

const extractTimeFromDate = (date: Date | Dayjs | null) =>
  date ? dayjs(date).format('HH:mm') : null;

describe('timeSchema', () => {
  it('should clamp today', () => {
    const customNow = dayjs('2024/05/08 10:30', 'YYYY/MM/DD HH:mm');
    vi.setSystemTime(customNow.toDate());

    expect(
      extractTimeFromDate(
        getMinimumPickupTimeForDate(
          dayjs('2024/05/08 10:30', 'YYYY/MM/DD HH:mm')
        )
      )
    ).toBe('12:30');
  });

  it('should clamp today with correct overflow', () => {
    const customNow = dayjs('2024/05/08 8:35', 'YYYY/MM/DD HH:mm');
    vi.setSystemTime(customNow.toDate());

    expect(
      extractTimeFromDate(
        getMinimumPickupTimeForDate(
          dayjs('2024/05/08 10:30', 'YYYY/MM/DD HH:mm')
        )
      )
    ).toBe('10:45');
  });

  it('should clamp today for last change', () => {
    const customNow = dayjs('2024/05/08 16:00', 'YYYY/MM/DD HH:mm');
    vi.setSystemTime(customNow.toDate());

    expect(
      extractTimeFromDate(
        getMinimumPickupTimeForDate(
          dayjs('2024/05/08 10:30', 'YYYY/MM/DD HH:mm')
        )
      )
    ).toBe('18:00');
  });

  it('should return null for today when too late', () => {
    const customNow = dayjs('2024/05/08 19:00', 'YYYY/MM/DD HH:mm');
    vi.setSystemTime(customNow.toDate());

    expect(
      getMinimumPickupTimeForDate(dayjs('2024/05/08 10:30', 'YYYY/MM/DD HH:mm'))
    ).toBe(null);
  });

  it('should return correct start on early today', () => {
    const customNow = dayjs('2024/05/08 7:40', 'YYYY/MM/DD HH:mm');
    vi.setSystemTime(customNow.toDate());

    expect(
      extractTimeFromDate(
        getMinimumPickupTimeForDate(
          dayjs('2024/05/08 10:30', 'YYYY/MM/DD HH:mm')
        )
      )
    ).toBe('10:00');
  });

  it('should return correct start on early other than today', () => {
    const customNow = dayjs('2024/05/08 9:00', 'YYYY/MM/DD HH:mm');
    vi.setSystemTime(customNow.toDate());

    expect(
      extractTimeFromDate(
        getMinimumPickupTimeForDate(
          dayjs('2024/05/09 10:30', 'YYYY/MM/DD HH:mm')
        )
      )
    ).toBe('10:00');
  });
});
