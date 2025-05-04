import { APP_BASE_URL } from '@constants';
import { database } from '@najit-najist/database';
import {
  OrderDeliveryMethodsSlug,
  OrderPaymentMethodsSlugs,
  products,
} from '@najit-najist/database/models';
import { getFileUrl } from '@server/utils/getFileUrl';
import { XMLBuilder } from 'fast-xml-parser';
import { NextRequest } from 'next/server';
import { stripHtml } from 'string-strip-html';

const builder = new XMLBuilder({
  arrayNodeName: 'SHOPITEM',
  format: true,
});

// https://napoveda.zbozi.cz/xml-feed/specifikace/

const categorySlugToCategoryText: Record<string, string> = {
  'balene-pecivo': 'Potraviny a nápoje | Potraviny | Pečivo | Trvanlivé pečivo',
  caje: 'Potraviny a nápoje | Nápoje | Nealkoholické nápoje | Horké nápoje | Čaje',
  cerealie: 'Potraviny a nápoje | Potraviny | Cereálie a müsli',
  'granola-musli': 'Potraviny a nápoje | Potraviny | Cereálie a müsli',
  'darkove-kose': 'Potraviny a nápoje | Potraviny | Dárkové potravinové koše',
  susenky: 'Potraviny a nápoje | Potraviny | Cukrovinky | Sušenky a oplatky',
};

const exceptDeliveryMethods = [
  OrderDeliveryMethodsSlug.DELIVERY_HRADEC_KRALOVE,
  OrderDeliveryMethodsSlug.LOCAL_PICKUP_EVENT_1,
  OrderDeliveryMethodsSlug.LOCAL_PICKUP,
] as const;

const deliveryMethodToXmlName: Omit<
  Record<
    (typeof OrderDeliveryMethodsSlug)[keyof typeof OrderDeliveryMethodsSlug],
    string
  >,
  (typeof exceptDeliveryMethods)[number]
> = {
  'send-balikovna': 'BALIKOVNA_NA_ADRESU',
  send: 'ZASILKOVNA',
};

export const GET = async (request: NextRequest): Promise<Response> => {
  const deliveryMethods = await database.query.orderDeliveryMethods.findMany({
    where: (schema, { not, eq, and, notInArray }) =>
      and(
        not(eq(schema.disabled, true)),
        notInArray(schema.slug, exceptDeliveryMethods as any),
      ),
  });

  const codPayment = await database.query.orderPaymentMethods.findFirst({
    where: (schema, { eq }) => eq(schema.slug, OrderPaymentMethodsSlugs.COD),
  });

  const exposedProducts = await database.query.products.findMany({
    where: (schema, { isNotNull, and }) => isNotNull(schema.publishedAt),
    with: {
      alergens: {
        with: { alergen: true },
      },
      category: {
        with: { onlyForCoupons: true },
      },
      composedOf: {
        with: {
          rawMaterial: {
            with: {
              partOf: true,
            },
          },
        },
      },
      discount: true,
      images: true,
      limitedToDeliveryMethods: true,
      onlyForCoupons: true,
      stock: true,
    },
  });
  const items = builder.build(
    exposedProducts.map((product) => ({
      ITEM_ID: product.id,
      PRODUCTNAME: product.name,
      DESCRIPTION: stripHtml(product.description ?? '').result,
      URL: new URL(`/produkty/${product.slug}`, APP_BASE_URL).toString(),
      PRICE_VAT: product.price,
      DELIVERY_DATE:
        product.stock?.value === undefined
          ? 0
          : product.stock.value > 0
            ? 0
            : -1,
      IMGURL: getFileUrl(products, product.id, product.images[0].file!),
      ...(product.images.length > 1 && {
        IMGURL_ALTERNATIVE: product.images
          .slice(1)
          .map((image) => getFileUrl(products, product.id, image.file)),
      }),
      ...(product.manufacturer && {
        MANUFACTURER: product.manufacturer,
      }),
      ...(!!product.category &&
        categorySlugToCategoryText[product.category.slug] && {
          CATEGORYTEXT: categorySlugToCategoryText[product.category.slug],
        }),
      DELIVERY: deliveryMethods.map((method) => ({
        DELIVERY_ID:
          deliveryMethodToXmlName[
            method.slug as keyof typeof deliveryMethodToXmlName
          ],
        DELIVERY_PRICE: method.price,
        ...((method.slug === OrderDeliveryMethodsSlug.BALIKOVNA ||
          method.slug === OrderDeliveryMethodsSlug.PACKETA) &&
          codPayment?.price && {
            DELIVERY_PRICE_COD: (method.price ?? 0) + codPayment.price,
          }),
      })),
    })),
  );

  return new Response(
    `<?xml version="1.0" encoding="utf-8"?><SHOP xmlns="http://www.zbozi.cz/ns/offer/1.0">${items}</SHOP>`,
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  );
};
