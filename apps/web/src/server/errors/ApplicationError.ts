import { ErrorCodes } from '@custom-types';

export class ApplicationError extends Error {
  public readonly code: ErrorCodes;
  public readonly origin: string;
  public readonly status: number;
  public readonly originalMessage: string;

  constructor({
    origin,
    message,
    code,
    options,
  }: {
    origin: string;
    message: string;
    code: ErrorCodes;
    options?: { statusCode?: number };
  }) {
    super(`[${origin}](${code}): ${message}`);
    this.originalMessage = message;
    this.code = code;
    this.origin = origin;
    this.status = options?.statusCode || 500;
  }
}
