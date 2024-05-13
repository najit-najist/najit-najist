import { PacketaPacketStatusCode } from './PacketaPacketStatusCode';

export type PacketaStatusRecord = {
  /**
   * Date and time of the status change. The format is Y-m-d\TH:i:s, example: 2016-07-25T12:00:00.
   */
  dateTime: string;
  /**
   * Integer status code, see the status code table for more info.
   */
  statusCode: PacketaPacketStatusCode;
  /**
   * Text representation of the code, see the status code table for more info.
   */
  codeText: string;
  /**
   * Text description of the status.
   */
  statusText: string;
  /**
   * ID of the position of the packet in the moment of the last status change. Defaults to 0 if the branch data is not available.
   * unsignedInt
   */
  branchId: string;
  /**
   * If status change regards moving to different branch, this field contains the ID of the destination branch. Defaults to 0 if the field is not relevant.
   * unsignedInt
   */
  destinationBranchId: string;
  /**
   * If the packet is being delivered by an external carrier and this status change indicates handing over of the packet to the carrier, you can find the carrier's tracking code here.
   */
  externalTrackingCode?: string;
};
