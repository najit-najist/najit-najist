import { ComgateLikeResponse } from './ComgateClient';

export type ComgateRequestErrorType = 'http-failed' | 'payload-not-ok';

export class ComgateRequestError extends Error {
  readonly type: ComgateRequestErrorType;
  readonly meta: object;

  constructor(type: 'http-failed', path: string, response: Response);
  constructor(
    type: 'payload-not-ok',
    path: string,
    response: Response,
    body: ComgateLikeResponse<any>
  );
  constructor(
    type: ComgateRequestErrorType,
    path: string,
    response: Response,
    body?: ComgateLikeResponse<any>
  ) {
    super('Failed to do request to comgate');

    this.type = type;
    this.meta = {
      path,
      response,
      body,
    };
  }
}
