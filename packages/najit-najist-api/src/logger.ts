import chalk, { ChalkInstance } from 'chalk';
import dayjs from 'dayjs';

const constructMessage = (
  color: ChalkInstance,
  type: keyof typeof logger,
  object: object | unknown,
  info: string
) => {
  const timeNow = dayjs().format('[DD.MM.YYYY@HH:mm:ss:SSS ]');
  const firstLineInfo = color([type, timeNow, ''].join(' - '));

  console.log(firstLineInfo + info);
  console.log(color('|'));
  console.log(color('|-') + JSON.stringify(object, null, 2));
};

export const logger = {
  info: (obj: object | unknown, info: string) =>
    constructMessage(chalk.blue, 'info', obj, info),
  error: (obj: object | unknown, info: string) =>
    constructMessage(chalk.red, 'error', obj, info),
  success: (obj: object | unknown, info: string) =>
    constructMessage(chalk.green, 'success', obj, info),
};
