import { PacketaWeekHours } from './PacketaWeekHours';

export type PacketaPointHours = {
  /**
   * HTML	The most compact version of business hours. May contain the following HTML: <br />, <strong>, <strong style='color: red;'>
   */
  compactShort: string;
  /**
   * HTML	Same as compactShort, more text may be used to explain upcoming changes. May contain the following HTML: <br />, <strong>, <strong style='color: red;'>
   */
  compactLong: string;
  /**
   * HTML	Provides business hours in a table with row for each day of week. More text may be used to explain upcoming changes. May contain the following HTML: <br />, <strong>, <strong style='color: red;'>, <table class='packetery-hours'>, <tr>, <th>, <th style='color: red;'>, <td>, <td colspan='2' align='center'>
   */
  tableLong: string;
  /**
   * Provides structured information about current business hours.
   */
  regular: PacketaWeekHours;
  /**
   * @deprecated Use field exceptionDays instead.
   */
  exceptions: any;
};
