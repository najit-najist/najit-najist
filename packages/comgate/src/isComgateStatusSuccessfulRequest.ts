import { ComgateError } from './ComgateError';
import { ComgateGetStatusSuccessResponse } from './ComgateGetStatusSuccessResponse';
import { ComgateNetworkError } from './ComgateNetworkError';

export const isComgateStatusSuccessfulRequest = (
  val: any,
): val is ComgateGetStatusSuccessResponse =>
  !(val instanceof ComgateError || val instanceof ComgateNetworkError);
