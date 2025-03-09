import type { getProduct } from '@server/utils/getProduct';
import { ReactNode } from 'react';

import type { AppRouterOutput } from './AppRouter';

declare module 'iron-session' {
  interface IronSessionData {
    authContent?: {
      userId: number;
    };
    cartId?: number;
    previewAuthorized?: boolean;
  }
}

export type PLAUSIBLE_EVENTS =
  | 'New user registration'
  | 'Contact form send'
  | 'Newsletter subscription from footer'
  | 'Like recipe'
  | 'Dislike recipe'
  | 'User order'
  | 'Product ordered'
  | 'User logged in'
  | 'User login invalid credentials'
  | 'AddToCart';

export interface LayoutProps {
  children: ReactNode;
  params: any;
}

export type LayoutComponent = (
  props: LayoutProps,
) => React.ReactNode | Promise<React.ReactNode>;

export type PostWithRelations =
  AppRouterOutput['posts']['getMany']['items'][number];

export type UserWithRelations = AppRouterOutput['users']['getOne'];
export type RecipeWithRelations = AppRouterOutput['recipes']['getOne'];
export type ProductWithRelationsLocal = NonNullable<
  Awaited<ReturnType<typeof getProduct>>
>;

export type OrderPaymentMethodWithRelations =
  AppRouterOutput['orders']['paymentMethods']['get']['many'][number];

export * from './ApplicationMode';
export * from './AppRouter';
export * from './ErrorCodes';
export * from './ErrorMessages';
export * from './UserTokenData';
