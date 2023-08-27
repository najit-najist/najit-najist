export { default as ContactFormReply } from './ContactFormReply';
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
