import { PacketaTime } from './PacketaTime';

export type PacketaExceptionDay = {
  /** YYYY-MM-DD start date */
  from: string;
  /** YYYY-MM-DD end date */
  to: string | null;
  times: PacketaTime[];
};
