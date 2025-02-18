import { Node as Logtail } from '@logtail/js';

export const logger = process.env.NEXT_PUBLIC_LOGTAIL_TOKEN
  ? new Logtail(process.env.NEXT_PUBLIC_LOGTAIL_TOKEN, {})
  : ({} as InstanceType<typeof Logtail>);
