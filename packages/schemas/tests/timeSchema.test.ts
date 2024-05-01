import { describe, expect, it } from 'vitest';

import { Time, ZodTimeOptions, zodTime } from '../src/timeSchema';

describe('timeSchema', () => {
  it.each(['hellothere', 'bad:00', '00:bad', '..', ':', '--:--'])(
    'should fail on incorrect input %c',
    (variant) => {
      const parsedString = zodTime().safeParse(variant);

      expect(parsedString.success).toBeFalsy();
      if (!parsedString.success) {
        expect(parsedString.error).toMatchSnapshot();
      }
    }
  );

  it.each([
    ['0:1', '00:01'],
    ['00:59', '00:59'],
    ['23:01', '23:01'],
    ['10:59', '10:59'],
  ])('should correctly parse correct time %s', (input, output) => {
    const parsedString = zodTime().safeParse(input);

    if (!parsedString.success) {
      throw new Error('should result in truthy');
    }

    expect(parsedString.data).toBe(output);
  });

  it.each([
    [{ max: '10:30' }, `10:31`],
    [{ min: '10:30' }, `9:00`],
  ] as Array<[ZodTimeOptions, Time]>)(
    'it correctly throws on incorrect time',
    (options, input) => {
      const parsedString = zodTime(options).safeParse(input);

      expect(parsedString.success).toBeFalsy();
      expect((parsedString as any).error).toMatchSnapshot();
    }
  );
});
