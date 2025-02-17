import { Alert } from '@components/common/Alert';
import { GoBackButton } from '@components/common/GoBackButton';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { FormBreak } from '@components/common/form/FormBreak';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { UserService } from '@server/services/UserService';
import { getCachedDeliveryMethods } from '@server/utils/getCachedDeliveryMethods';
import { getCachedPaymentMethods } from '@server/utils/getCachedPaymentMethods';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { formatPrice } from '@utils';
import { getUserCart } from '@utils/getUserCart';
import { cookies as getCookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ComponentProps } from 'react';

import { CheckoutButton } from './_internals/CheckoutButton';
import { CouponInfo } from './_internals/CouponInfo';
import {
  DeliveryMethodFormPart,
  DeliveryMethodFormPartProps,
} from './_internals/DeliveryMethodFormPart';
import { FormProvider } from './_internals/FormProvider';
import { OtherInformationsFormPart } from './_internals/OtherInformationsFormPart';
import { PaymentMethodFormPart } from './_internals/PaymentMethodFormPart';
import { PriceList } from './_internals/PriceList';
import { UserContactFormPart } from './_internals/UserContactFormPart';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dokončení objednávky',
};

// TODO: this page should be behind dynamic page - each cart should have its own subpage. that way it will be faster for user
export default async function Page() {
  const cookies = await getCookies();
  const session = await getSessionFromCookies({ cookies });

  const loggedInUser = session.authContent?.userId
    ? await UserService.getOneBy('id', session.authContent?.userId)
    : null;
  const cart = await getUserCart({
    type: loggedInUser ? 'user' : 'cart',
    value: Number(loggedInUser?.id ?? session.cartId ?? '0'),
  });

  if (!cart?.products.length || !loggedInUser) {
    return redirect('/muj-ucet/kosik');
  }

  const [deliveryMethods, paymentMethods, lastOrder] = await Promise.all([
    (
      getCachedDeliveryMethods() as Promise<
        DeliveryMethodFormPartProps['deliveryMethods']
      >
    ).then(
      (methods) =>
        new Map(
          methods.map((d) => {
            d.name = `${d.name} (${formatPrice(d.price ?? 0)})`;

            return [d.id, d];
          }),
        ),
    ),
    getCachedPaymentMethods().then((methods) =>
      methods.map((d) => {
        d.name = `${d.name} (${formatPrice(d.price ?? 0)})`;

        return d;
      }),
    ),
    database.query.orders.findFirst({
      where: (schema, { eq }) => eq(schema.userId, loggedInUser.id),
      orderBy: (schema, { desc }) => desc(schema.createdAt),
      with: {
        telephone: true,
        address: {
          with: {
            municipality: true,
          },
        },
        deliveryMethod: true,
        paymentMethod: true,
        invoiceAddress: {
          with: {
            municipality: true,
          },
        },
      },
    }),
  ]);

  // Sometimes user can have product in cart which limits their choices of delivery methods
  let productsInCartLimitDeliveryMethods = false;

  // Create new set for delivery method
  for (const productInCart of cart.products) {
    if (productInCart.product.onlyForDeliveryMethod) {
      const deliveryMethod = deliveryMethods.get(
        productInCart.product.onlyForDeliveryMethod.id,
      );

      if (deliveryMethod) {
        deliveryMethod.disabled = false;

        if (!productsInCartLimitDeliveryMethods) {
          productsInCartLimitDeliveryMethods = true;
        }
      }
    }
  }

  if (productsInCartLimitDeliveryMethods) {
    for (const [, deliveryMethod] of deliveryMethods) {
      deliveryMethod.disabled ??= true;
    }
  }

  const deliverMethodsAsArray = [...deliveryMethods.values()];
  const defaultDeliveryMethod = deliverMethodsAsArray
    .filter((d) => !d.disabled)
    .at(0);

  if (!defaultDeliveryMethod) {
    logger.error(
      {
        cart: {
          id: cart.id,
        },
        products: cart.products.map((p) => ({
          id: p.product,
          onlyForDeliveryMethod: p.product.onlyForDeliveryMethod,
        })),
        deliveryMethods: deliverMethodsAsArray.map((d) => ({ id: d.id })),
      },
      'Wrong cart product x delivery method combination',
    );
  }

  const defaultPaymentMethod = paymentMethods.find(
    (item) =>
      !item.exceptDeliveryMethods
        .map(({ id }) => id)
        .includes(defaultDeliveryMethod?.id ?? 0),
  );

  const paymentMethodPrices = Object.fromEntries(
    paymentMethods.map(({ slug, price }) => [slug, price ?? 0]),
  );
  const deliveryMethodsPrices = Object.fromEntries(
    deliverMethodsAsArray.map(({ slug, price }) => [slug, price ?? 0]),
  );

  const cartHasProductMoreThanStock = cart.products.find(
    ({ product, count: countInCart }) =>
      product.stock ? product.stock.value < countInCart : false,
  );

  const defaultFormValues: ComponentProps<
    typeof FormProvider
  >['defaultFormValues'] = lastOrder
    ? {
        deliveryMethod: { slug: lastOrder.deliveryMethod.slug ?? null },
        paymentMethod: { slug: lastOrder.paymentMethod.slug ?? null },
        address: {
          ...lastOrder.address,
          city: lastOrder.address?.city ?? '',
          houseNumber: lastOrder?.address?.houseNumber ?? '',
          postalCode: lastOrder?.address?.postalCode ?? '',
          streetName: lastOrder?.address?.streetName ?? '',
        },
        businessInformations: lastOrder.ico
          ? { ico: lastOrder.ico, dic: lastOrder.dic }
          : undefined,
        invoiceAddress: lastOrder.invoiceAddress
          ? {
              ...lastOrder.invoiceAddress,
              city: lastOrder.invoiceAddress?.city ?? '',
              houseNumber: lastOrder?.invoiceAddress?.houseNumber ?? '',
              postalCode: lastOrder?.invoiceAddress?.postalCode ?? '',
              streetName: lastOrder?.invoiceAddress?.streetName ?? '',
            }
          : undefined,
        notes: lastOrder.notes ?? undefined,
        email: loggedInUser?.email ?? '',
        firstName: loggedInUser?.firstName ?? '',
        lastName: loggedInUser?.lastName ?? '',
        telephoneNumber: lastOrder?.telephone?.telephone ?? '',
      }
    : {
        deliveryMethod: { slug: defaultDeliveryMethod?.slug ?? null },
        paymentMethod: { slug: defaultPaymentMethod?.slug ?? null },
        address: {
          municipality: { id: null as any },
          ...loggedInUser?.address,
          city: loggedInUser?.address?.city ?? '',
          houseNumber: loggedInUser?.address?.houseNumber ?? '',
          postalCode: loggedInUser?.address?.postalCode ?? '',
          streetName: loggedInUser?.address?.streetName ?? '',
        },
        email: loggedInUser?.email ?? '',
        firstName: loggedInUser?.firstName ?? '',
        lastName: loggedInUser?.lastName ?? '',
        telephoneNumber: loggedInUser?.telephone?.telephone ?? '',
      };

  return (
    <>
      <div className="container mt-5 sm:-mb-5">
        <GoBackButton href="/muj-ucet/kosik" text="Zpět do košíku" />
      </div>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
        </div>
      </PageHeader>
      <FormProvider defaultFormValues={defaultFormValues}>
        <section className="container">
          {loggedInUser && defaultDeliveryMethod ? (
            <>
              <FormBreak label="Kontaktní informace" className="mb-6" />
              <UserContactFormPart />
              <FormBreak label="Doručovací metoda" className="mt-12 mb-6" />
              <DeliveryMethodFormPart
                paymentMethods={paymentMethods}
                deliveryMethods={deliverMethodsAsArray}
              />
              <FormBreak label="Platební metoda" className="mt-12 mb-6" />
              <PaymentMethodFormPart paymentMethods={paymentMethods} />
              <FormBreak label="Doplňující informace" className="mt-12 mb-6" />
              <OtherInformationsFormPart />
            </>
          ) : null}
          {!defaultDeliveryMethod ? (
            <Alert
              outlined
              color="error"
              icon={ExclamationTriangleIcon}
              heading="Omlouváme se, ale kombinací produktů ve vašem košíku nemůžeme momentálně dodat. Neváhejte nás kontaktovat."
            />
          ) : null}
        </section>

        <section className="w-full bg-white mt-10">
          <h2 className="sr-only">Souhrn objednávky</h2>
          <div className="mt-2 mb-7">
            <div className="container mb-6">
              <CouponInfo cartCupon={cart.coupon} />
            </div>
            <PriceList
              paymentMethodsPrices={paymentMethodPrices}
              deliveryMethodsPrices={deliveryMethodsPrices}
              subtotal={cart.subtotal}
              totalDiscount={cart.discount}
            />

            <div className="container pb-8">
              {cartHasProductMoreThanStock ? (
                <div className="my-4">
                  <Alert
                    heading="Upozornění"
                    color="warning"
                    icon={ExclamationTriangleIcon}
                  >
                    Jeden z produktů ve Vašem košíku přesahuje naše skladové
                    možnosti a tak nemůžeme zajistit úplné dodání. Budeme Vás po
                    vytvoření objednávky kontaktovat.
                  </Alert>
                </div>
              ) : null}
              <CheckoutButton />
            </div>
          </div>
        </section>
      </FormProvider>
    </>
  );
}
