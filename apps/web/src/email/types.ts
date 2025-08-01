import {
  Coupon,
  CouponPatch,
  Municipality,
  Order,
  OrderDeliveryMethod,
  OrderPaymentMethod,
  OrderedAddress,
  OrderedProduct,
  Product,
  ProductCategory,
  ProductStock,
  TelephoneNumber,
} from '@najit-najist/database/models';
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

type UnsignedModel<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type OrderWithRelations = Order & {
  orderedProducts: (OrderedProduct & {
    product: Product & {
      images: string[];
      stock?: UnsignedModel<ProductStock> | null;
      category?: ProductCategory | null;
    };
  })[];
  deliveryMethod: UnsignedModel<OrderDeliveryMethod>;
  paymentMethod: UnsignedModel<OrderPaymentMethod>;
  address: Omit<UnsignedModel<OrderedAddress>, 'municipalityId' | 'orderId'> & {
    municipality: Pick<Municipality, 'name' | 'slug'>;
  };
  invoiceAddress?:
    | (Omit<UnsignedModel<OrderedAddress>, 'municipalityId' | 'orderId'> & {
        municipality: Pick<Municipality, 'name' | 'slug'>;
      })
    | null;
  telephone?: UnsignedModel<TelephoneNumber> | null;
  couponPatch:
    | (CouponPatch & {
        coupon: Coupon;
      })
    | null;
};
