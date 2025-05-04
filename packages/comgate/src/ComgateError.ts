import { ComgateLikeResponse } from './ComgateClient';
import { ComgateErrorResponseCode } from './ComgateErrorResponseCode';

export class ComgateError<
  TErrorType extends ComgateErrorResponseCode,
  TBody extends ComgateLikeResponse<any>,
> extends Error {
  constructor(
    readonly type: TErrorType,
    readonly options: {
      path: string;
      response: Response;
      body: TBody;
    },
  ) {
    super('Failed to do request to comgate');
  }
}
