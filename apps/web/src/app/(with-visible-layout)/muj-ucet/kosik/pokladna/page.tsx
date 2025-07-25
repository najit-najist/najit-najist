import { Alert } from '@components/common/Alert';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { GoBackButton } from '@components/common/GoBackButton';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { FormBreak } from '@components/common/form/FormBreak';
import { LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER } from '@constants';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { logger } from '@logger/server';
import { database } from '@najit-najist/database';
import { OrderDeliveryMethodsSlug } from '@najit-najist/database/models';
import { UserService } from '@server/services/UserService';
import { getCachedDeliveryMethods } from '@server/utils/getCachedDeliveryMethods';
import { getCachedPaymentMethods } from '@server/utils/getCachedPaymentMethods';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { formatPrice } from '@utils';
import { getUserCart } from '@utils/getUserCart';
import { cookies as getCookies } from 'next/headers';
import Link from 'next/link';
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

  if (!cart?.products.length) {
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

            return [d.slug, d];
          }),
        ),
    ),
    getCachedPaymentMethods().then((methods) =>
      methods.map((d) => {
        d.name = `${d.name} (${formatPrice(d.price ?? 0)})`;

        return d;
      }),
    ),
    loggedInUser
      ? database.query.orders.findFirst({
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
        })
      : null,
  ]);

  // Sometimes user can have product in cart which limits their choices of delivery methods
  const hasProductsWithLimitedDelivery = cart.products.some(
    ({ product }) => product.limitedToDeliveryMethods.length,
  );

  // Create new set for delivery method
  const methodSettings = new Map<OrderDeliveryMethodsSlug, number>();
  if (hasProductsWithLimitedDelivery) {
    let numberOfProductsThatMustBeSupported = 0;

    for (const { product } of cart.products) {
      if (!product.limitedToDeliveryMethods.length) {
        continue;
      }

      numberOfProductsThatMustBeSupported += 1;

      for (const {
        deliveryMethod: { slug },
      } of product.limitedToDeliveryMethods) {
        methodSettings.set(slug, (methodSettings.get(slug) ?? 0) + 1);
      }
    }

    for (const [, deliveryMethod] of deliveryMethods) {
      const occurencesCountForMethod =
        methodSettings.get(deliveryMethod.slug) ?? 0;

      // Delivery method must be supported by every product with limited availability
      if (occurencesCountForMethod === numberOfProductsThatMustBeSupported) {
        deliveryMethod.disabled ??= false;
      } else {
        deliveryMethod.disabled ??= true;
      }
    }
  }

  const deliverMethodsAsArray = [...deliveryMethods.values()].sort(
    ({ disabled }) => (disabled ? 1 : -1),
  );
  const defaultDeliveryMethod = deliverMethodsAsArray
    .filter((d) => !d.disabled)
    .at(0);

  if (!defaultDeliveryMethod) {
    logger.error(
      '[PRECHECKOUT] Wrong cart product x delivery method combination',
      {
        cart: {
          id: cart.id,
        },
        products: cart.products.map((p) => ({
          id: p.product,
        })),
        deliveryMethods: deliverMethodsAsArray.map((d) => ({ id: d.id })),
      },
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
        deliveryMethod: deliveryMethods.get(lastOrder.deliveryMethod.slug)
          ?.disabled
          ? { slug: defaultDeliveryMethod?.slug ?? null }
          : { slug: lastOrder.deliveryMethod.slug ?? null },
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
      <div className="container -mt-5 mb-10">
        {!loggedInUser ? (
          <Alert
            outlined
            color="warning"
            icon={ExclamationTriangleIcon}
            heading="Máte u nás již účet? Přihlašte se a nebo registrujte pro rychlejší objednávku!"
            className="mt-3"
          >
            <div className="flex gap-2 mt-2">
              <Link
                className={buttonStyles()}
                href={`/login?${LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER}=%2Fmuj-ucet%2Fkosik%2Fpokladna`}
              >
                Přihlásit se
              </Link>
              <Link
                className={buttonStyles()}
                href={`/registrace?${LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER}=%2Fmuj-ucet%2Fkosik%2Fpokladna`}
              >
                Registrovat se
              </Link>
            </div>
          </Alert>
        ) : null}
      </div>
      <FormProvider defaultFormValues={defaultFormValues}>
        <section className="container">
          {defaultDeliveryMethod ? (
            <>
              <FormBreak label="Kontaktní informace" className="mb-6" />
              <UserContactFormPart isUserLoggedIn={!!loggedInUser} />

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
              heading="Omlouváme se, ale kombinaci produktů ve Cašem košíku nemůžeme momentálně dodat. Kontaktujte nás prosím co nejdříve."
            />
          ) : null}
        </section>

        {defaultDeliveryMethod ? (
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
                      možnosti a tak nemůžeme zajistit úplné dodání. Budeme Vás
                      po vytvoření objednávky kontaktovat.
                    </Alert>
                  </div>
                ) : null}
                <CheckoutButton />
              </div>
            </div>
          </section>
        ) : null}
      </FormProvider>
    </>
  );
}
