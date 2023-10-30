import { ReactNode } from 'react';

export type PLAUSIBLE_EVENTS =
  | 'New user registration'
  | 'Contact form send'
  | 'Newsletter subscription from footer'
  | 'Like recipe'
  | 'Dislike recipe';

export interface LayoutProps {
  children: ReactNode;
  params: any;
}

export type LayoutComponent = (
  props: LayoutProps
) => React.ReactNode | Promise<React.ReactNode>;
