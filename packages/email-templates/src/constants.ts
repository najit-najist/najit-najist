import { OrderState, Product } from '@najit-najist/database/models';

import { OrderWithRelations } from './types';

const productBase = {
  createdAt: new Date(),
  updatedAt: null,
  categoryId: 4,
  createdById: null,
  onlyForDeliveryMethodId: null,
  publishedAt: null,
  updateById: null,
} satisfies Partial<Product>;

export const testOrder: OrderWithRelations = {
  id: 0,
  userId: 1,
  deliveryMethodId: 1,
  notes: null,
  paymentMethodId: 2,
  telephoneId: 1,
  updatedAt: null,
  address: {
    city: 'City',
    houseNumber: '12',
    municipality: {
      name: 'Hradec Kralové',
      slug: 'hradec-kralove',
    },
    postalCode: '50801',
    streetName: 'Jičín',
  },
  createdAt: new Date(),
  email: 'test@example.com',
  firstName: 'Otaka',
  lastName: 'Shimada',
  deliveryMethodPrice: 200,
  paymentMethodPrice: 0,
  paymentMethod: {
    description: 'sdfds',
    name: 'Převodem na účet',
    paymentOnCheckout: false,
    slug: 'cod',
    price: 200,
    notes: 'asdfaodsjfoadsjfoasdj',
  },
  orderedProducts: [
    {
      count: 2,
      createdAt: new Date(),
      id: 1,
      orderId: 1,
      productId: 4,
      updatedAt: null,
      totalPrice: 400,
      product: {
        ...productBase,
        id: 2,
        images: [],
        name: 'Produkt moc dlouhy',
        slug: '/produkt',
        description: 'Very loooooooong description',
        stock: {
          value: 1,
          productId: 2,
        },
        price: { discount: null, value: 100, productId: 2 },
      },
    },
    {
      count: 2,
      createdAt: new Date(),
      id: 3,
      orderId: 1,
      productId: 4,
      updatedAt: null,
      totalPrice: 400,
      product: {
        ...productBase,
        id: 4,
        images: [],
        name: 'Produkt moc dlouhy',
        slug: '/produkt',
        description: 'Very loooooooong description',
        stock: {
          value: 1,
          productId: 4,
        },
        price: { discount: null, value: 100, productId: 4 },
      },
    },
  ],
  state: OrderState.UNPAID,
  subtotal: 0,
  telephoneNumber: {
    telephone: '12323434',
    code: '420',
  },
  deliveryMethod: {
    description: '',
    name: 'Poštou',
    price: 200,
    slug: '/sdfsdf/',
    notes: '',
  },
};
