import { default as dayjsOriginal, Dayjs } from 'dayjs';
import 'dayjs/locale/cs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjsOriginal.extend(timezone);
dayjsOriginal.extend(relativeTime);
dayjsOriginal.extend(utc);

dayjsOriginal.locale('cs');
const DEFAULT_TIMEZONE = 'Europe/Berlin';
dayjsOriginal.tz.setDefault(DEFAULT_TIMEZONE);

export { DEFAULT_TIMEZONE, Dayjs };

export const dayjs = dayjsOriginal;
