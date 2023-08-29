import pino from 'pino';

const transport = pino.transport({
  target: '@logtail/pino',
  options: { sourceToken: process.env.NEXT_PUBLIC_LOGTAIL_TOKEN },
});

export const logger = pino(transport);
