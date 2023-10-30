import { ReactNode } from 'react';

export type PLAUSIBLE_EVENTS =
  | 'user_registration'
  | 'contact_send'
  | 'footer_newsletter_subscribe'
  | 'interact_recipe';

export interface LayoutProps {
  children: ReactNode;
  params: any;
}

export type LayoutComponent = (
  props: LayoutProps
) => React.ReactNode | Promise<React.ReactNode>;
