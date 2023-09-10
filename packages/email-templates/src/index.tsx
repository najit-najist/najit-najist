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
