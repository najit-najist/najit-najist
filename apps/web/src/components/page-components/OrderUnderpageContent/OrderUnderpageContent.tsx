import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import {
  AppRouterOutput,
  AvailableModels,
  getFileUrl,
  orderStates,
} from '@najit-najist/api';
import { Alert, Tooltip } from '@najit-najist/ui';
import NextImage from 'next/image';
import Link from 'next/link';
import { FC, Fragment } from 'react';
import { z } from 'zod';

import { EditOrderControllbar } from './EditOrderControlbar';
import { OrderSubtitle } from './OrderSubtitle';

export type OrderUnderpageViewType = 'update' | 'view';

export type OrderUnderpageProps = {
  order: AppRouterOutput['orders']['get']['one'];
  viewType: OrderUnderpageViewType;
};

const orderStateToTitle: Record<z.infer<typeof orderStates>, string> = {
  confirmed: 'Brzy to bude!',
  dropped: 'Zrušeno',
  finished: 'A je to doma!',
  unconfirmed: 'Pracujeme na tom!',
  unpaid: 'Čekáme na platbu',
  new: 'Pracujeme na tom!',
  shipped: 'Odesláno!',
};

export const OrderUnderpageContent: FC<OrderUnderpageProps> = async (props) => {
  const { order, viewType } = props;

  return (
    <div className="pb-24 pt-16">
      <div className="mx-auto container">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-x-5 gap-y-10">
          <div className="md:max-w-xl">
            <h1 className="text-base font-medium text-project-primary">
              {viewType === 'view' ? (
                'Děkujeme!'
              ) : (
                <>
                  Objednávka uživatele{' '}
                  <Tooltip
                    trigger={
                      <Link
                        className="text-project-secondary underline"
                        href={`/administrace/uzivatele/${order.user?.id}`}
                      >
                        {order.user?.firstName} {order.user?.lastName}
                      </Link>
                    }
                  >
                    Přejít na uživatele
                  </Tooltip>
                </>
              )}
            </h1>
            <p
              className="mt-2 text-5xl font-bold tracking-tight font-title"
              data-state={order.state}
            >
              {orderStateToTitle[order.state]}
            </p>
            <OrderSubtitle {...props} />

            <dl className="mt-12 text-sm font-medium">
              <dt className="text-gray-900">Referenční číslo objednávky</dt>
              <dd className="mt-2 text-project-primary">{order.id}</dd>
            </dl>
          </div>
          {viewType !== 'view' ? (
            <aside className="md:max-w-sm w-full flex-none">
              <EditOrderControllbar {...props} />
            </aside>
          ) : null}
        </div>

        <section
          aria-labelledby="order-heading"
          className="mt-10 border-t border-gray-200"
        >
          <h2 id="order-heading" className="sr-only">
            Vaše objednávka
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
                    {cartItem.product.description ? (
                      <div
                        className="mt-2 text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: cartItem.product.description,
                        }}
                      ></div>
                    ) : null}
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
                          Cena za produkt celkem:
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
                  <p>{order.payment_method.name}</p>
                  {order.state === 'unpaid' && order.payment_method.notes ? (
                    <Alert
                      color="warning"
                      heading={
                        <>
                          <ExclamationTriangleIcon className="w-4 h-4 inline" />{' '}
                          Důležitá informace
                        </>
                      }
                      className="mt-3"
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: order.payment_method.notes,
                        }}
                      ></div>
                    </Alert>
                  ) : null}
                  {/* <p>Mastercard</p>
                  <p>
                    <span aria-hidden="true">••••</span>
                    <span className="sr-only">Ending in </span>1545
                  </p> */}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-project-secondary">
                  Doručovací metoda
                </dt>
                <dd className="mt-2 text-gray-700">
                  {order.delivery_method ? (
                    <>
                      <p>{order.delivery_method.name}</p>
                      <p className="mt-1">
                        {order.delivery_method.description}
                      </p>
                    </>
                  ) : (
                    <p>Neznámá doručovací metoda</p>
                  )}
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Přehled</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Mezisoučet</dt>
                <dd className="text-gray-700">{order.subtotal} Kč</dd>
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
                <dd className="text-gray-700">
                  {order.delivery_method?.price
                    ? `${order.delivery_method.price} Kč`
                    : 'Zdarma'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-bold text-gray-900">Celkem</dt>
                <dd className="text-project-secondary">
                  {order.subtotal + (order.delivery_method?.price ?? 0)} Kč
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
};
