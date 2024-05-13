export enum PacketaPointError {
  /**
   * The pick-up point is temporarily closed due to staff vacation. The state persists at least for a week, typically 1 or 2 weeks.
   */
  VACAY = 'vacation',
  /**
   * The pick-up point is currently over maximum capacity.
   */
  FULL = 'full',
  /**
   * The pick-up point will be closed in near future. Displaying a pick-up point in such a case will help the customer understand why the pick-up point is not available anymore.
   */
  CLOSING = 'closing',
  /**
   * Various other reasons.
   */
  TECHNICAL = 'technical',
  /**
   * If an unknown string value occurs (new reason introduced in the future), treat it as technical.
   */
  OTHER = 'xxx',
}
