import { PacketaAllowTrackingForUsers } from './PacketaAllowTrackingForUsers';

export type PacketaSecurity = {
  /**
   * Allow each user to view the tracking of the packet.
   */
  allowPublicTracking?: boolean;
  /**
   * Allow specified users to view the tracking of the packet.
   */
  allowTrackingForUsers?: PacketaAllowTrackingForUsers;
};
