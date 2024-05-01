import { default as dayjsOriginal } from 'dayjs';
import 'dayjs/locale/cs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjsOriginal.extend(timezone);
dayjsOriginal.extend(relativeTime);
dayjsOriginal.extend(utc);

dayjsOriginal.locale('cs');

export const dayjs = dayjsOriginal;
