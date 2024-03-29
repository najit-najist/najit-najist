export {
  default as ContactUsAdminReply,
  type ContactUsAdminReplyProps,
} from './ContactUsAdminReply';
export {
  default as ContactUsUserReply,
  type ContactUsUserReplyProps,
} from './ContactUsUserReply';

export {
  default as FinishRegistrationFromPreview,
  type FinishRegistrationFromPreviewProps,
} from './FinishRegistrationFromPreview';

export {
  default as ThankYouOrder,
  type ThankYouOrderProps,
} from './ThankYouOrder';
export {
  default as ThankYouOrderAdmin,
  type ThankYouOrderAdminProps,
} from './ThankYouOrderAdmin';

export {
  default as OrderConfirmed,
  type OrderConfirmedProps,
} from './OrderConfirmed';

export {
  default as OrderShipped,
  type OrderShippedProps,
} from './OrderShipped';

export type {
  Attachment,
  BaseEmailProps,
  FileAttachment,
  LinkAttachment,
  NewsletterComponent,
} from './types.js';

export { render, renderAsync } from '@react-email/render';

export default function Mail() {
  return <>Hi!</>;
}
