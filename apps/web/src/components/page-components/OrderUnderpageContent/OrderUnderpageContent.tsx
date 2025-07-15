import { Badge } from '@components/common/Badge';
import { Skeleton } from '@components/common/Skeleton';
import { Tooltip } from '@components/common/Tooltip';
import { DEFAULT_DATE_FORMAT } from '@constants';
import { dayjs } from '@dayjs';
import { database } from '@najit-najist/database';
import { Order, OrderState } from '@najit-najist/database/models';
import { formatPrice } from '@utils';
import { orderGetTotalPrice } from '@utils/orderGetTotalPrice';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, Suspense } from 'react';

import { EditOrderControllbar } from './EditOrderControlbar';
import { OrderSubtitle } from './OrderSubtitle';
import { OrderSubtitleSkeleton } from './OrderSubtitleSkeleton';
import { PacketaControlbar } from './PacketaControllbar';
import { ProductSkeleton } from './ProductSkeleton';
import { SectionAddressAndShipping } from './SectionAddressAndShipping';
import { SectionInvoiceAddress } from './SectionInvoiceAddress';
import { SectionPayment } from './SectionPayment';
import { SectionProducts } from './SectionProducts';
import { SectionShipping } from './SectionShipping';

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
    <div className="mb-5 pt-16">
      <div className="mx-auto container mb-10">
        <div className="md:max-w-3xl w-full">
          <section>
            <h1 className="text-base font-medium text-project-primary">
              {viewType === 'view' ? (
                'Děkujeme za objednávku 🎉'
              ) : (
                <>
                  Objednávka uživatele{' '}
                  {order.user ? (
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
                  ) : (
                    <span>
                      {order.firstName} {order.lastName}
                    </span>
                  )}
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

            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-6">
              <dl className="text-sm font-medium">
                <dt className="text-gray-900">Referenční číslo objednávky</dt>
                <dd className="mt-2 text-project-primary text-lg">
                  #{order.id}
                </dd>
              </dl>
              <dl className="text-sm font-medium">
                <dt className="text-gray-900">Datum a čas objednávky</dt>
                <dd className="mt-2 text-project-primary text-lg">
                  {dayjs.tz(order.createdAt).format(DEFAULT_DATE_FORMAT)}
                </dd>
              </dl>
            </div>
          </section>
        </div>
      </div>

      {viewType !== 'view' ? (
        <div className="container mx-auto">
          <Suspense fallback={<Skeleton className="w-full h-72" />}>
            <section className="w-full flex sm:flex-col md:flex-row gap-5">
              <EditOrderControllbar {...props} order={order} />
              <PacketaControlbar order={order} />
            </section>
          </Suspense>
        </div>
      ) : null}

      <div className="mx-auto container pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 py-10 border-t border-gray-200 mt-8 gap-8 sm:gap-5">
          <section aria-labelledby="address-heading">
            <h4 className="sr-only" id="address-heading">
              Doručovací a fakturační informace
            </h4>
            <Suspense
              fallback={
                <div className="grid gap-x-6">
                  <Skeleton className="h-5 w-full max-w-32" />
                  <Skeleton className="mt-2 h-16 w-full max-w-64" />
                  <Skeleton className="mt-4 h-11 w-full max-w-32" />
                </div>
              }
            >
              <SectionAddressAndShipping order={order} />
            </Suspense>
          </section>

          {order.invoiceAddressId ? (
            <section aria-labelledby="address-heading">
              <h4 className="sr-only" id="address-heading">
                Fakturační informace
              </h4>
              <Suspense
                fallback={
                  <div className="grid gap-x-6">
                    <Skeleton className="h-5 w-full max-w-32" />
                    <Skeleton className="mt-2 h-16 w-full max-w-64" />
                    <Skeleton className="mt-4 h-11 w-full max-w-32" />
                  </div>
                }
              >
                <SectionInvoiceAddress order={order} />
              </Suspense>
            </section>
          ) : null}

          <section
            aria-labelledby="more-information-heading"
            className={order.invoiceAddressId ? '' : 'sm:col-span-2'}
          >
            <h4 className="sr-only" id="more-information-heading">
              Další informace
            </h4>
            <dl className="text-sm">
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
            </dl>
          </section>

          <section aria-labelledby="shipping-heading">
            <h4 className="sr-only" id="shipping-heading">
              Způsob odeslání
            </h4>
            <Suspense
              fallback={
                <div className="grid gap-x-6">
                  <Skeleton className="h-5 w-full max-w-32" />
                  <Skeleton className="mt-2 h-16 w-full max-w-64" />
                </div>
              }
            >
              <SectionShipping order={order} />
            </Suspense>
          </section>

          <section aria-labelledby="payment-heading">
            <h4 className="sr-only" id="payment-heading">
              Způsob platby
            </h4>
            <Suspense
              fallback={
                <div className="grid gap-x-6">
                  <Skeleton className="h-5 w-full max-w-32" />
                  <Skeleton className="mt-2 h-16 w-full max-w-64" />
                </div>
              }
            >
              <SectionPayment viewType={viewType} order={order} />
            </Suspense>
          </section>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200">
        <section
          aria-labelledby="order-heading"
          className="mx-auto container pt-10 pb-16"
        >
          <h2 id="order-heading" className="sr-only">
            Produkty ve vaší objednávce
          </h2>

          <h3 className="sr-only">Items</h3>
          <Suspense
            fallback={new Array(3).fill(true).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          >
            <SectionProducts orderId={orderId} />
          </Suspense>

          <h3 className="sr-only">Přehled</h3>

          <div className="grid grid-cols-1 gap-2 pt-5">
            <dl className="space-y-6">
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
            </dl>

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

            <div className="flex justify-between border-t border-gray-200 pt-5 mt-3">
              <dt className="font-bold text-gray-900">Celkem</dt>
              <dd className="text-project-secondary">
                {order.discount ? (
                  <>
                    <s>
                      {formatPrice(
                        orderGetTotalPrice(order, { applyDiscount: false }),
                      )}
                    </s>{' '}
                  </>
                ) : null}
                {formatPrice(orderGetTotalPrice(order))}
              </dd>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
