import { Logtail } from '@logtail/browser';

export const logger =
  process.env.NEXT_PUBLIC_LOGTAIL_TOKEN &&
  process.env.NODE_ENV !== 'development'
    ? new Logtail(process.env.NEXT_PUBLIC_LOGTAIL_TOKEN!)
    : undefined;
