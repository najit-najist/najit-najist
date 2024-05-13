export enum PacketaPacketStatusCode {
  /**
   * We have received the packet data. Freshly created packet.
   */
  'received data' = '1',
  /**
   * Packet has been accepted at our branch.
   */
  arrived = '2',
  /**
   * branchId, destinationBranchId	Packet is waiting to be dispatched from branch branchId to branch destinationBranchId.
   */
  'prepared for departure' = '3',
  /**
   * branchId, destinationBranchId	Packet is on the way from branch branchId to branch destinationBranchId.
   */
  departed = '4',
  /**
   * for pickup	branchId	Packet has been delivered to its destination (branchId), the customer has been informed via SMS.
   */
  'ready for pickup' = '5',
  /**
   * to carrier	externalTrackingCode	Packet has been handed over to an external carrier for delivery. It can be traced via carrier's tracking application under externalTrackingCode.
   */
  'handed to carrier' = '6',
  /**
   * branchId	Packet was picked up by the customer at the branch branchId.
   */
  delivered = '7',
  /**
   * Packet is on the way back to the sender.
   */
  'posted back' = '9',
  /**
   * Packet has been returned to the sender.
   */
  returned = '10',
  /**
   * Packet has been cancelled.
   */
  cancelled = '11',
  /**
   * Packet has been collected and is on its way to the depot branchId.
   */
  collected = '12',
  /**
   * Customs declaration process.
   */
  customs = '14',
  /**
   * Reverse packet has been accepted at our branch.
   */
  'reverse packet arrived		' = '15',
  /**
   * Packeta Home made unsuccessful delivery attempt of packet.
   */
  'delivery attempt' = '16',
  /**
   * Packeta Home delivery attempt of packet end in rejected by recipient response.
   */
  'rejected by recipient' = '17',
  /**
   * 	Unknown packet status.
   */
  unknown = '999',
}
