import { ReactNode } from 'react';

export type PLAUSIBLE_EVENTS =
  | 'New user registration'
  | 'Contact form send'
  | 'Newsletter subscription from footer'
  | 'Like recipe'
  | 'Dislike recipe'
  | 'User order'
  | 'Product ordered'
  | 'User logged in'
  | 'User login invalid credentials';

export interface LayoutProps {
  children: ReactNode;
  params: any;
}

export type LayoutComponent = (
  props: LayoutProps
) => React.ReactNode | Promise<React.ReactNode>;
