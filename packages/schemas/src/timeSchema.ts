import { z } from 'zod';

const timeRegex = /^[0-2]?[0-9]:[0-5]?[0-9]$/;

export type Time = `${number}:${number}`;
export type ZodTimeOptions = {
  max?: Time;
  min?: Time;
};

const MAX_HOUR = 23;
const MAX_MINUTE = 59;

const isValidTimeString = (value: any): value is `${number}:${number}` => {
  if (typeof value !== 'string' || !timeRegex.test(value)) {
    return false;
  }

  const [hours, minutes] = value.split(':');

  return !Number.isNaN(+hours) && !Number.isNaN(+minutes) && +hours <= 23;
};

const timeToNumber = (value: Time): number => Number(value.replace(':', ''));

export const zodTime = (options?: ZodTimeOptions) => {
  let { max = `${MAX_HOUR}:${MAX_MINUTE}`, min = `00:00` } = {
    ...(options ?? {}),
  };

  const minAsNumber = timeToNumber(min);
  const maxAsNumber = timeToNumber(max);

  return z
    .custom<Time>(
      (value) => {
        if (!isValidTimeString(value)) {
          return false;
        }

        const valueAsNumber = timeToNumber(value);

        return minAsNumber <= valueAsNumber && maxAsNumber >= valueAsNumber;
      },
      (value) => {
        let message = 'Čas musí být vyplněn a ve formátu HH:MM';
        if (isValidTimeString(value)) {
          const valueAsNumber = timeToNumber(value);
          if (minAsNumber > valueAsNumber) {
            message = `Čas musí být alespoň od ${min}`;
          } else if (maxAsNumber < valueAsNumber) {
            message = `Čas musí být maximálně do ${min}`;
          }
        }

        return {
          fatal: true,
          message,
        };
      }
    )
    .transform((value) => {
      const [hours, minutes] = value.split(':');

      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    });
};

export const timeSchema = zodTime();
