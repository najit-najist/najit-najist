import { ComgateOrderState } from './ComgateOrderState';
import { ComgateResponseCode } from './ComgateResponseCode';

export type ComgateGetStatusSuccessResponse = {
  code: ComgateResponseCode.OK;
  message: string;
  merchant: string;
  status: ComgateOrderState;
};
