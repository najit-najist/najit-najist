import { ComgateErrorResponseCode } from './ComgateErrorResponseCode';
import { ComgateSuccessResponseCode } from './ComgateSuccessResponseCode';

export type ComgateResponseCode =
  | ComgateSuccessResponseCode
  | ComgateErrorResponseCode;
