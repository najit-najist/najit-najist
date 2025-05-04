import { ComgateOrderState } from './ComgateOrderState';

export type ComgateGetStatusSuccessResponse = {
  message: string;
  merchant: string;
  status: ComgateOrderState;
};
