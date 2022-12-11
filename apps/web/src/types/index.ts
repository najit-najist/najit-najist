import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  params: any;
}

export type LayoutComponent = (
  props: LayoutProps
) => React.ReactNode | Promise<React.ReactNode>;
