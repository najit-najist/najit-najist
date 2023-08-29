import { Logtail } from '@logtail/browser';

export const logger = new Logtail(process.env.NEXT_PUBLIC_LOGTAIL_TOKEN!);
