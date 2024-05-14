import { PacketaStatusRecord } from './PacketaStatusRecord';

export type PacketaCurrentStatusRecord = PacketaStatusRecord & {
  /**
   * Indicates whether the packet is on its way back to the sender.
   */
  isReturning: boolean;
  /**
   * 	The last possible day to pick up the packet. After this date, it will start returning to the sender.
   */
  storedUntil: string;
  /**
   * Numeric identifier of the chosen carrier method.
   */
  carrierId?: string;
  /**
   * Name of the chosen carrier method, in english.
   */
  carrierName?: string;
};
