import {
  AppRouterOutput,
  AvailableModels,
  Order,
  getFileUrl,
  orderStates,
} from '@najit-najist/api';
import NextImage from 'next/image';
import Link from 'next/link';
import { FC, Fragment, ReactNode } from 'react';
import { z } from 'zod';

export type OrderUnderpageProps = {
  order: AppRouterOutput['orders']['get']['one'];
};

const orderStateToTitle: Record<z.infer<typeof orderStates>, string> = {
  confirmed: 'Brzy to bude!',
  dropped: 'Zrušeno',
  finished: 'Je to u Vás!',
  unconfirmed: 'Pracujeme na tom!',
  unpaid: 'Čekáme na Vaši platbu',
  new: 'Pracujeme na tom!',
};

export const OrderUnderpageContent: FC<OrderUnderpageProps> = async ({
  order,
}) => {
  const deliveryMethod = order.payment_method.delivery_method;

  const orderStateToSubtitle: Record<z.infer<typeof orderStates>, ReactNode> = {
    confirmed: (
      <>
        Vaše objednávka <b>#{order.id}</b> je potvrzená!{' '}
        {typeof deliveryMethod !== 'string' ? (
          deliveryMethod.slug === 'local-pickup' ? (
            <>Již brzy dostanete info pro vyzvednutí!</>
          ) : (
            <>Nyní Vaši objednávku zabalíme a odešleme.</>
          )
        ) : null}
      </>
    ),
    dropped: 'Tato objednávka byla zrušena. Jak smutné 😢',
    finished:
      'Tato objednávka byla úspěšně dokončena a měli by jste ji mít už v rukou. Nezapomeňte na hodnocení!',
    new: 'Tato objednávka je pouze vytvořena a čeká na další akci',
    unconfirmed: `Blahopřejeme k vytvořené objednávky! Nyní počkejte na potvrzení z naší strany.`,
    unpaid:
      'Tato objednávka je vytvořena, ale nezaplacena. Zaplaťte prosím objednávku, aby jsme s ní mohli pokračovat.',
  };

  return (
    <div className="pb-24 pt-16">
      <div className="mx-auto container">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-project-primary">
            Děkujeme!
          </h1>
          <p className="mt-2 text-5xl font-bold tracking-tight font-title">
            {orderStateToTitle[order.state]}
          </p>
          <p className="mt-2 text-base text-gray-500">
            {orderStateToSubtitle[order.state]}
          </p>

          <dl className="mt-12 text-sm font-medium">
            <dt className="text-gray-900">Referenční číslo objednávky</dt>
            <dd className="mt-2 text-project-primary">{order.id}</dd>
          </dl>
        </div>

        <section
          aria-labelledby="order-heading"
          className="mt-10 border-t border-gray-200"
        >
          <h2 id="order-heading" className="sr-only">
            Your order
          </h2>

          <h3 className="sr-only">Items</h3>
          {order.products.map((cartItem) => {
            if (typeof cartItem.product === 'string') {
              return <Fragment key={cartItem.id}></Fragment>;
            }

            let mainImage = cartItem.product.images.at(0);

            if (mainImage) {
              mainImage = getFileUrl(
                AvailableModels.PRODUCTS,
                cartItem.product.id,
                mainImage
              );
            }

            return (
              <div
                key={cartItem.id}
                className="flex space-x-6 border-b border-gray-200 py-10"
              >
                {mainImage ? (
                  <NextImage
                    src={mainImage}
                    alt={'Obrázek produktu'}
                    width={80}
                    height={80}
                    className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
                  />
                ) : null}
                <div className="flex flex-auto flex-col">
                  <div>
                    <h4 className="font-medium text-gray-900 font-title text-2xl">
                      <Link href={`/produkty/${cartItem.product.id}`}>
                        {cartItem.product.name}
                      </Link>
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">
                      {cartItem.product.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-1 items-end">
                    <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                      <div className="flex">
                        <dt className="font-medium text-gray-900">Počet: </dt>
                        <dd className="ml-2 text-gray-700">
                          {cartItem.count}x
                        </dd>
                      </div>
                      <div className="flex pl-4 sm:pl-6">
                        <dt className="font-medium text-gray-900">
                          Cena celkem:
                        </dt>
                        <dd className="ml-2 text-gray-700">
                          {cartItem.totalPrice} Kč
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="sm:ml-40 sm:pl-6">
            <h3 className="sr-only">Vaše informace</h3>

            <h4 className="sr-only">Adresy</h4>
            <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
              <div>
                <dt className="font-semibold text-project-secondary">
                  Doručovací adresa
                </dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">
                      {order.firstName} {order.lastName}
                    </span>
                    <span className="block">
                      {order.address_streetName}, {order.address_houseNumber}
                    </span>
                    <span className="block">
                      {order.address_city} {order.address_postalCode}
                    </span>
                  </address>
                </dd>
              </div>
              <div>
                {/* <dt className="font-medium text-gray-900">Billing address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">Kristin Watson</span>
                    <span className="block">7363 Cynthia Pass</span>
                    <span className="block">Toronto, ON N3Y 4H8</span>
                  </address>
                </dd> */}
              </div>
            </dl>

            <h4 className="sr-only">Platba</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
              <div>
                <dt className="font-semibold text-project-secondary">
                  Platební metoda
                </dt>
                <dd className="mt-2 text-gray-700">
                  <p>Apple Pay</p>
                  <p>Mastercard</p>
                  <p>
                    <span aria-hidden="true">••••</span>
                    <span className="sr-only">Ending in </span>1545
                  </p>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-project-secondary">
                  Doručovací metoda
                </dt>
                <dd className="mt-2 text-gray-700">
                  <p>DHL</p>
                  <p>Takes up to 3 working days</p>
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Přehled</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Mezisoučet</dt>
                <dd className="text-gray-700">{order.totalPrice} Kč</dd>
              </div>
              {/* <div className="flex justify-between">
                <dt className="flex font-medium text-gray-900">
                  Sleva
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                    STUDENT50
                  </span>
                </dt>
                <dd className="text-gray-700">-$18.00 (50%)</dd>
              </div> */}
              {/* TODO: Save shipping price into order  */}
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Doprava</dt>
                <dd className="text-gray-700">$5.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-bold text-gray-900">Celkem</dt>
                <dd className="text-gray-900">{order.totalPrice} Kč</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
};
