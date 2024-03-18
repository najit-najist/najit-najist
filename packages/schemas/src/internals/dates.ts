import { default as dayjsOriginal } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjsOriginal.extend(timezone);
dayjsOriginal.extend(relativeTime);
dayjsOriginal.extend(utc);

import('dayjs/locale/cs');
dayjsOriginal.locale('cs');

export const dayjs = dayjsOriginal;
