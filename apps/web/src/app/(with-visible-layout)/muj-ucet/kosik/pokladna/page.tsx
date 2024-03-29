import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { Section } from '@components/portal';
import { logger } from '@najit-najist/api/server';
import {
  getCachedDeliveryMethods,
  getCachedLoggedInUser,
  getCachedPaymentMethods,
  getCachedTrpcCaller,
} from '@server-utils';
import clsx from 'clsx';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import { CartItem } from './_components/CartItem/CartItem';
import { CheckoutButton } from './_components/CheckoutButton';
import {
  DeliveryMethodFormPart,
  DeliveryMethodFormPartProps,
} from './_components/DeliveryMethodFormPart';
import { EmptyCart } from './_components/EmptyCart';
import { FormProvider } from './_components/FormProvider';
import { PaymentMethodFormPart } from './_components/PaymentMethodFormPart';
import { PriceList } from './_components/PriceList';
import { UserContactFormPart } from './_components/UserContactFormPart';

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
  // User should be logged in already
  const user = await getCachedLoggedInUser();
  const productsInCart =
    await getCachedTrpcCaller().profile.cart.products.get.many();

  if (!productsInCart.length) {
    return <EmptyCart />;
  }

  const [deliveryMethods, paymentMethods] = await Promise.all([
    (
      getCachedDeliveryMethods() as Promise<
        DeliveryMethodFormPartProps['deliveryMethods']
      >
    ).then((methods) => new Map(methods.map((d) => [d.id, d]))),
    getCachedPaymentMethods(),
  ]);

  // Sometimes user can have product in cart which limits their choices of delivery methods
  let productsInCartLimitDeliveryMethods = false;

  // Create new set for delivery method
  for (const productInCart of productsInCart) {
    if (productInCart.product.onlyDeliveryMethods.length) {
      for (const deliveryMethodId of productInCart.product
        .onlyDeliveryMethods) {
        const deliveryMethod = deliveryMethods.get(deliveryMethodId);

        if (deliveryMethod) {
          deliveryMethod.disabled = false;

          if (!productsInCartLimitDeliveryMethods) {
            productsInCartLimitDeliveryMethods = true;
          }
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
          id: user?.id,
        },
        products: productsInCart.map((p) => ({
          id: p.product,
          onlyDeliveryMethods: p.product.onlyDeliveryMethods,
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
      !item.except_delivery_methods.includes(defaultDeliveryMethod.id ?? '')
  );

  const priceTotal = productsInCart.reduce(
    (priceTotalPredicate, cartItem) =>
      priceTotalPredicate + cartItem.product.price.value * cartItem.count,
    0
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
          deliveryMethod: { id: defaultDeliveryMethod.id ?? null },
          paymentMethod: { id: defaultPaymentMethod?.id ?? null },
          address: {
            city: '',
            houseNumber: '',
            postalCode: '',
            streetName: '',
            municipality: { id: null as any },
            ...user?.address,
          },
          email: user?.email ?? '',
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          telephoneNumber: user?.telephoneNumber ?? '',
          saveAddressToAccount: false,
        }}
      >
        {/* TODO This form should take default values from user */}
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
            <Section rootClassName="lg:sticky top-28">
              <ul role="list" className="divide-y divide-gray-200">
                {productsInCart.map((cartItem) => (
                  <CartItem
                    key={cartItem.id}
                    deliveryMethods={deliveryMethods}
                    {...cartItem}
                  />
                ))}
              </ul>
              <PriceList price={{ total: priceTotal }} />
              <hr className="!mt-0" />
              <CheckoutButton />
            </Section>
          </div>
        </div>
      </FormProvider>
    </>
  );
}
