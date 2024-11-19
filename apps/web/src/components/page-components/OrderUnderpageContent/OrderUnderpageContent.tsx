import { database } from '@najit-najist/database';
import { Order, OrderState } from '@najit-najist/database/models';
import { Badge, Skeleton, Tooltip } from '@najit-najist/ui';
import { formatPrice, getTotalPrice } from '@utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';

import { EditOrderControllbar } from './EditOrderControlbar';
import { OrderSubtitle } from './OrderSubtitle';
import { OrderSubtitleSkeleton } from './OrderSubtitleSkeleton';
import { PacketaControlbar } from './PacketaControllbar';
import { ProductSkeleton } from './ProductSkeleton';
import { SectionAddress } from './SectionAddress';
import { SectionProducts } from './SectionProducts';
import { SectionShipmentPayment } from './SectionShipmentPayment';

export type OrderUnderpageViewType = 'update' | 'view';

export type OrderUnderpageProps = {
  orderId: Order['id'];
  viewType: OrderUnderpageViewType;
};

const orderStateToTitle: Record<
  (typeof OrderState)[keyof typeof OrderState],
  string
> = {
  confirmed: 'Brzy to bude!',
  dropped: 'Zrušeno',
  finished: 'A je to doma!',
  unconfirmed: 'Pracujeme na tom!',
  unpaid: 'Čekáme na platbu',
  new: 'Pracujeme na tom!',
  shipped: 'Odesláno!',
};

export const OrderUnderpageContent: FC<OrderUnderpageProps> = async (props) => {
  const { orderId, viewType } = props;
  const order = await database.query.orders.findFirst({
    where: (s, { eq }) => eq(s.id, orderId),
    with: {
      user: true,
      couponPatch: {
        with: {
          coupon: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

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
            <Suspense fallback={<OrderSubtitleSkeleton />}>
              <OrderSubtitle {...props} order={order} />
            </Suspense>

            <dl className="mt-12 text-sm font-medium">
              <dt className="text-gray-900">Referenční číslo objednávky</dt>
              <dd className="mt-2 text-project-primary">{order.id}</dd>
            </dl>
          </div>
          {viewType !== 'view' ? (
            <aside className="md:max-w-sm w-full flex-none">
              <Suspense fallback={<Skeleton className="w-full h-72" />}>
                <EditOrderControllbar {...props} order={order} />
              </Suspense>
              <Suspense>
                <PacketaControlbar order={order} />
              </Suspense>
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
          <Suspense
            fallback={new Array(3).fill(true).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          >
            <SectionProducts orderId={orderId} />
          </Suspense>

          <div className="sm:ml-40 sm:pl-6">
            <h3 className="sr-only">Vaše informace</h3>

            <h4 className="sr-only">Adresy</h4>
            <Suspense
              fallback={
                <div className="py-10">
                  <Skeleton className="h-5 w-full max-w-32" />
                  <Skeleton className="mt-2 h-16 w-full max-w-40" />
                  <Skeleton className="mt-4 h-11 w-full max-w-32" />
                </div>
              }
            >
              <SectionAddress order={order} />
            </Suspense>

            <h4 className="sr-only">Platba a odeslání</h4>
            <Suspense
              fallback={
                <div className="grid grid-cols-2 gap-x-6 py-10">
                  <div>
                    <Skeleton className="h-5 w-full max-w-32" />
                    <Skeleton className="mt-2 h-16 w-full max-w-40" />
                    <Skeleton className="mt-4 h-11 w-full max-w-32" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-full max-w-32" />
                    <Skeleton className="mt-2 h-16 w-full max-w-40" />
                    <Skeleton className="mt-4 h-11 w-full max-w-32" />
                  </div>
                </div>
              }
            >
              <SectionShipmentPayment viewType={viewType} order={order} />
            </Suspense>

            <h4 className="sr-only">Další informace</h4>
            <dl className="border-t border-gray-200 py-10 text-sm">
              <div>
                <dt className="font-semibold text-project-secondary">
                  Poznámky k objednávce
                </dt>
                <dd className="mt-2 text-gray-700">
                  <p>
                    {order.notes || (
                      <span className="opacity-50">Žádná poznámka</span>
                    )}
                  </p>
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Přehled</h3>
            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Mezisoučet</dt>
                <dd className="text-gray-700">{formatPrice(order.subtotal)}</dd>
              </div>
              {order.discount ? (
                <div className="flex justify-between">
                  <dt className="flex font-medium text-gray-900">
                    Sleva
                    <Badge color="blue" className="ml-2">
                      {order.couponPatch?.coupon.name ?? 'Neznámý kupón'}
                    </Badge>
                  </dt>
                  <dd className="text-gray-700">
                    - {formatPrice(order.discount)} (
                    {[
                      order.couponPatch?.reductionPercentage
                        ? `${order.couponPatch.reductionPercentage}%`
                        : undefined,
                      order.couponPatch?.reductionPrice
                        ? formatPrice(order.couponPatch.reductionPrice)
                        : undefined,
                    ]
                      .filter(Boolean)
                      .join(' + ')}
                    )
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Doprava</dt>
                <dd className="text-gray-700">
                  {formatPrice(order.deliveryMethodPrice ?? 0)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Platební metoda</dt>
                <dd className="text-gray-700">
                  {formatPrice(order.paymentMethodPrice ?? 0)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-bold text-gray-900">Celkem</dt>
                <dd className="text-project-secondary">
                  {order.discount ? (
                    <>
                      <s>
                        {formatPrice(
                          getTotalPrice(order, { applyDiscount: false }),
                        )}
                      </s>{' '}
                    </>
                  ) : null}
                  {formatPrice(getTotalPrice(order))}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
};
