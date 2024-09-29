'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import {
  OrderDeliveryMethod,
  OrderPaymentMethod,
} from '@najit-najist/database/models';
import { Alert } from '@najit-najist/ui';
import { formatPrice, getTotalPrice } from '@utils';
import { formatDeliveryMethodPrice } from '@utils/formatDeliveryMethodPrice';
import clsx from 'clsx';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';

export const PriceList: FC<{
  subtotal: number;
  totalDiscount: number;
  deliveryMethodsPrices: Record<string, number>;
  paymentMethodsPrices: Record<string, number>;
}> = ({
  subtotal,
  totalDiscount,
  paymentMethodsPrices,
  deliveryMethodsPrices,
}) => {
  const { isActive: transitionIsHappening } = useReactTransitionContext();
  const [deliveryMethod, paymentMethod] = useWatch<
    {
      deliveryMethod: OrderDeliveryMethod;
      paymentMethod: OrderPaymentMethod;
    },
    ['deliveryMethod', 'paymentMethod']
  >({
    name: ['deliveryMethod', 'paymentMethod'],
  });

  const selectedDeliveryMethodPrice: number | undefined =
    deliveryMethodsPrices[deliveryMethod.slug];

  const deliveryMethodPrice = formatDeliveryMethodPrice(
    selectedDeliveryMethodPrice,
    { subtotal },
  );

  const selectedPaymentMethodPrice: number | undefined =
    paymentMethodsPrices[paymentMethod.slug];

  return (
    <div className="px-4 text-gray-500">
      <div className="flex items-center justify-between py-5">
        <span>Mezisoučet</span>
        <span
          className={clsx(
            'text-gray-900',
            transitionIsHappening ? 'blur-sm' : '',
          )}
        >
          {formatPrice(subtotal)}
        </span>
      </div>
      {!!totalDiscount ? (
        <>
          <hr />
          <div className="flex items-center justify-between py-5">
            <span>Sleva</span>
            <span
              className={clsx(
                'text-project-primary',
                transitionIsHappening ? 'blur-sm' : '',
              )}
            >
              - {formatPrice(totalDiscount)}
            </span>
          </div>
        </>
      ) : null}
      {selectedDeliveryMethodPrice !== undefined ? (
        <>
          <hr />
          <div className="flex items-center justify-between py-5">
            <span>Doprava</span>
            <span
              className={clsx(
                'text-gray-900',
                transitionIsHappening ? 'blur-sm' : '',
              )}
            >
              {formatPrice(deliveryMethodPrice.formatted)}
              {deliveryMethodPrice.formatted !==
              deliveryMethodPrice.original ? (
                <span className="text-gray-300">
                  {' '}
                  (<s>{formatPrice(selectedDeliveryMethodPrice)}</s>)
                </span>
              ) : null}
            </span>
          </div>
          {deliveryMethodPrice.formatted !== deliveryMethodPrice.original ? (
            <Alert
              heading="Gratulujeme!"
              color="success"
              className="mb-4 -mt-2"
            >
              Získáváte dopravu zdarma, jelikož Vaše objednávka překračuje
              hodnotu {formatPrice(formatDeliveryMethodPrice.limit)}
            </Alert>
          ) : null}
        </>
      ) : null}
      {selectedPaymentMethodPrice !== undefined ? (
        <>
          <hr />
          <div className="flex items-center justify-between py-5">
            <span>Platební metoda</span>
            <span
              className={clsx(
                'text-gray-900',
                transitionIsHappening ? 'blur-sm' : '',
              )}
            >
              {formatPrice(selectedPaymentMethodPrice)}
            </span>
          </div>
        </>
      ) : null}
      <hr />
      <div className="flex items-center justify-between py-5 font-semibold text-gray-900">
        <span>Celkově</span>
        <span className={clsx(transitionIsHappening ? 'blur-sm' : '')}>
          {formatPrice(
            getTotalPrice({
              deliveryMethodPrice: deliveryMethodPrice.formatted,
              paymentMethodPrice: selectedPaymentMethodPrice,
              subtotal: subtotal - totalDiscount,
            }),
          )}
        </span>
      </div>
    </div>
  );
};
