import { Node as Logtail } from '@logtail/js';
import type { StackContextHint } from '@logtail/types';

const logtail = process.env.NEXT_PUBLIC_LOGTAIL_TOKEN
  ? new Logtail(process.env.NEXT_PUBLIC_LOGTAIL_TOKEN, {})
  : undefined;

const stackContextHint: StackContextHint = {
  fileName: 'node_modules/pino',
  methodNames: [
    'log',
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'silent',
  ],
  required: true,
};

export const logger = {
  error: (message: string, meta?: Record<string, any>) => {
    logtail?.log(message, 'error', meta, stackContextHint);
  },
  warn: (message: string, meta?: Record<string, any>) => {
    logtail?.log(message, 'warn', meta, stackContextHint);
  },
  info: (message: string, meta?: Record<string, any>) => {
    logtail?.log(message, 'info', meta, stackContextHint);
  },
};
