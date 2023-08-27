import { FC } from 'react';

export type BaseEmailProps = {
  newsletterUuid?: string;
};

export type NewsletterComponent<T = Record<any, any>> = FC<
  BaseEmailProps & T
> & {
  attachments?: Attachment[];
  subject?: string;
};

export type Attachment = {
  title: string;
  content: FileAttachment | LinkAttachment;
};

export type FileAttachment = {
  type: 'file';
  /**
   * Resulted filename
   */
  resultFilename: string;
  /**
   * Content file path
   */
  filepath: string;
};

export type LinkAttachment = {
  type: 'link';
  /**
   * Content url
   */
  content: string;
};
