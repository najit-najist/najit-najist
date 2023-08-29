import pino from 'pino';

const transport = process.env.NEXT_PUBLIC_LOGTAIL_TOKEN
  ? pino.transport({
      target: '@logtail/pino',
      options: { sourceToken: process.env.NEXT_PUBLIC_LOGTAIL_TOKEN },
    })
  : undefined;

export const logger = pino(transport);
