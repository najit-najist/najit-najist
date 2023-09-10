import { Logtail } from '@logtail/browser';

export const logger = process.env.NEXT_PUBLIC_LOGTAIL_TOKEN
  ? new Logtail(process.env.NEXT_PUBLIC_LOGTAIL_TOKEN!)
  : undefined;
