import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { Section } from '@components/portal';
import { logger } from '@server/logger';
import { getCachedDeliveryMethods } from '@server/utils/getCachedDeliveryMethods';
import { getCachedPaymentMethods } from '@server/utils/getCachedPaymentMethods';
import { getLoggedInUser, getLoggedInUserId } from '@server/utils/server';
import { formatPrice } from '@utils';
import { getCartItemPrice } from '@utils/getCartItemPrice';
import { getUserCart } from '@utils/getUserCart';
import clsx from 'clsx';
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

export default async function Page() {
  const userId = await getLoggedInUserId();
  const [user, cart] = await Promise.all([
    await getLoggedInUser(),
    await getUserCart({ id: userId }),
  ]);

  if (!cart.products.length) {
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
          })
        )
    ),
    getCachedPaymentMethods().then((methods) =>
      methods.map((d) => {
        d.name = `${d.name} (${formatPrice(d.price ?? 0)})`;

        return d;
      })
    ),
  ]);

  // Sometimes user can have product in cart which limits their choices of delivery methods
  let productsInCartLimitDeliveryMethods = false;

  // Create new set for delivery method
  for (const productInCart of cart.products) {
    if (productInCart.product.onlyForDeliveryMethod) {
      const deliveryMethod = deliveryMethods.get(
        productInCart.product.onlyForDeliveryMethod.id
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
        user: {
          id: userId,
        },
        products: cart.products.map((p) => ({
          id: p.product,
          onlyForDeliveryMethod: p.product.onlyForDeliveryMethod,
        })),
        deliveryMethods: deliverMethodsAsArray.map((d) => ({ id: d.id })),
      },
      'User wrong cart product x delivery method combination'
    );

    throw new Error(
      'Omlouváme se, ale kombinací produktů ve vašem košíku nemůžeme momentálně dodat.'
    );
  }

  const defaultPaymentMethod = paymentMethods.find(
    (item) =>
      !item.exceptDeliveryMethods
        .map(({ id }) => id)
        .includes(defaultDeliveryMethod.id ?? '')
  );

  const paymentMethodPrices = Object.fromEntries(
    paymentMethods.map(({ slug, price }) => [slug, price ?? 0])
  );
  const deliveryMethodsPrices = Object.fromEntries(
    deliverMethodsAsArray.map(({ slug, price }) => [slug, price ?? 0])
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
          deliveryMethod: { slug: defaultDeliveryMethod.slug ?? null },
          paymentMethod: { slug: defaultPaymentMethod?.slug ?? null },
          address: {
            municipality: { id: null as any },
            ...user.address,
            city: user.address?.city ?? '',
            houseNumber: user.address?.houseNumber ?? '',
            postalCode: user.address?.postalCode ?? '',
            streetName: user.address?.streetName ?? '',
          },
          email: user.email ?? '',
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          telephoneNumber: user.telephone?.telephone ?? '',
          saveAddressToAccount: false,
        }}
      >
        <div className="container flex flex-col lg:flex-row gap-10">
          <div className="w-full">
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
          </div>
          <div className="w-full lg:max-w-md">
            <SectionTitle className="mb-3">Souhrn objednávky</SectionTitle>
            <Section>
              <ul role="list" className="divide-y divide-gray-200">
                {cart.products.map((cartItem) => (
                  <CartItem key={cartItem.id} data={cartItem} />
                ))}
              </ul>
              <CouponInfo cartCupon={cart.coupon} />
              <PriceList
                paymentMethodsPrices={paymentMethodPrices}
                deliveryMethodsPrices={deliveryMethodsPrices}
                subtotal={cart.subtotal}
                totalDiscount={cart.discount}
              />
              <hr className="!mt-0" />
              <CheckoutButton />
            </Section>
          </div>
        </div>
      </FormProvider>
    </>
  );
}
