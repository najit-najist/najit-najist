import { ComgateGetStatusSuccessResponse } from './ComgateGetStatusSuccessResponse';
import { ComgateResponseCode } from './ComgateResponseCode';

export const isComgateStatusSuccessfulRequest = (
  val: any,
): val is ComgateGetStatusSuccessResponse =>
  val.code === ComgateResponseCode.OK;
