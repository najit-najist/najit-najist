import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { Section } from '@components/portal';
import { LOGIN_THEN_REDIRECT_SILENT_TO_PARAMETER } from '@constants';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { Alert, buttonStyles } from '@najit-najist/ui';
import { logger } from '@server/logger';
import { UserService } from '@server/services/UserService';
import { getCachedDeliveryMethods } from '@server/utils/getCachedDeliveryMethods';
import { getCachedPaymentMethods } from '@server/utils/getCachedPaymentMethods';
import { getSessionFromCookies } from '@server/utils/getSessionFromCookies';
import { formatPrice } from '@utils';
import { getUserCart } from '@utils/getUserCart';
import clsx from 'clsx';
import { cookies as getCookies } from 'next/headers';
import Link from 'next/link';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import { CartItem } from './_internals/CartItem/CartItem';
import { CheckoutButton } from './_internals/CheckoutButton';
import { CouponInfo } from './_internals/CouponInfo';
import {
  DeliveryMethodFormPart,
  DeliveryMethodFormPartProps,
} from './_internals/DeliveryMethodFormPart';
import { EmptyCart } from './_internals/EmptyCart';
import { FormProvider } from './_internals/FormProvider';
import { PaymentMethodFormPart } from './_internals/PaymentMethodFormPart';
import { PriceList } from './_internals/PriceList';
import { UserContactFormPart } from './_internals/UserContactFormPart';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dokončení objednávky',
};

const SectionTitle: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
> = ({ children, className, ...rest }) => (
  <h2
    className={clsx('text-2xl font-title tracking-wide mb-3 mt-5', className)}
    {...rest}
  >
    {children}
  </h2>
);

// TODO: this page should be behind dynamic page - each cart should have its own subpage. that way it will be faster for user
export default async function Page() {
  const cookies = getCookies();
  const session = await getSessionFromCookies({ cookies });

  const loggedInUser = session.authContent?.userId
    ? await UserService.getOneBy('id', session.authContent?.userId)
    : null;
  const cart = await getUserCart({
    type: loggedInUser ? 'user' : 'cart',
    value: Number(loggedInUser?.id ?? session.cartId ?? '0'),
  });

  if (!cart?.products.length) {
    return <EmptyCart />;
  }

  const [deliveryMethods, paymentMethods] = await Promise.all([
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

  return (
    <>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
        </div>
      </PageHeader>
      <FormProvider
        defaultFormValues={{
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
          saveAddressToAccount: false,
        }}
      >
        <div className="container flex flex-col lg:flex-row gap-10">
          <div className="w-full">
            {loggedInUser && defaultDeliveryMethod ? (
              <>
                <SectionTitle>Kontaktní adresa</SectionTitle>
                <UserContactFormPart />
                <SectionTitle className="border-t border-gray-200 pt-8 mt-8">
                  Výběr dopravy
                </SectionTitle>
                <DeliveryMethodFormPart
                  paymentMethods={paymentMethods}
                  deliveryMethods={deliverMethodsAsArray}
                />
                <SectionTitle className="border-t border-gray-200 pt-8 mt-8">
                  Výběr platby
                </SectionTitle>
                <PaymentMethodFormPart paymentMethods={paymentMethods} />
              </>
            ) : null}
            {!loggedInUser ? (
              <Alert
                outlined
                color="warning"
                icon={ExclamationTriangleIcon}
                heading="Pro dokončení objednávky se prosím přihlašte!"
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
            {!defaultDeliveryMethod ? (
              <Alert
                outlined
                color="error"
                icon={ExclamationTriangleIcon}
                heading="Omlouváme se, ale kombinací produktů ve vašem košíku nemůžeme momentálně dodat. Neváhejte nás kontaktovat."
              />
            ) : null}
          </div>
          <div className="w-full lg:max-w-md">
            <SectionTitle className="mb-3">Souhrn objednávky</SectionTitle>
            <Section>
              <ul role="list" className="divide-y divide-gray-200">
                {cart.products.map((cartItem) => (
                  <CartItem key={cartItem.id} data={cartItem} />
                ))}
              </ul>
              {loggedInUser ? <CouponInfo cartCupon={cart.coupon} /> : null}
              <PriceList
                paymentMethodsPrices={paymentMethodPrices}
                deliveryMethodsPrices={deliveryMethodsPrices}
                subtotal={cart.subtotal}
                totalDiscount={cart.discount}
              />
              {loggedInUser ? (
                <>
                  <hr className="!mt-0" />
                  {cartHasProductMoreThanStock ? (
                    <div className="mx-4">
                      <Alert
                        heading="Upozornění"
                        color="warning"
                        icon={ExclamationTriangleIcon}
                      >
                        Jeden z produktů ve Vašem košíku přesahuje naše skladové
                        možnosti a tak nemůžeme zajistit úplné dodání. Budeme
                        Vás po vytvoření objednávky kontaktovat.
                      </Alert>
                    </div>
                  ) : null}
                  <CheckoutButton />
                </>
              ) : null}
            </Section>
          </div>
        </div>
      </FormProvider>
    </>
  );
}
