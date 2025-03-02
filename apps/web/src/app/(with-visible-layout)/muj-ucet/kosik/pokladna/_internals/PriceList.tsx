'use client';

import { Alert } from '@components/common/Alert';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import {
  OrderDeliveryMethod,
  OrderPaymentMethod,
} from '@najit-najist/database/models';
import { formatPrice } from '@utils';
import { formatDeliveryMethodPrice } from '@utils/formatDeliveryMethodPrice';
import { orderGetTotalPrice } from '@utils/orderGetTotalPrice';
import clsx from 'clsx';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

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
  const { formState } = useFormContext();
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
    <>
      <div className="border-y-2 border-dashed text-gray-500 border-gray-200">
        <div className="container divide-y divide-gray-200">
          <div className="flex items-center justify-between py-5">
            <span className="text-sm">Mezisoučet</span>
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
            <div className="flex items-center justify-between py-5">
              <span className="text-sm">Sleva</span>
              <span
                className={clsx(
                  'text-project-primary',
                  transitionIsHappening ? 'blur-sm' : '',
                )}
              >
                - {formatPrice(totalDiscount)}
              </span>
            </div>
          ) : null}
          {selectedDeliveryMethodPrice !== undefined ? (
            <div>
              <div className="flex items-center justify-between py-5">
                <span className="text-sm">Doprava</span>
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
              {deliveryMethodPrice.formatted !==
              deliveryMethodPrice.original ? (
                <Alert
                  heading="Gratulujeme! 🎉"
                  color="success"
                  className="mb-4 -mt-2"
                >
                  Získáváte dopravu zdarma, jelikož Vaše objednávka překračuje
                  hodnotu {formatPrice(formatDeliveryMethodPrice.limit)}
                </Alert>
              ) : null}
            </div>
          ) : null}
          {selectedPaymentMethodPrice !== undefined ? (
            <>
              <div className="flex items-center justify-between py-5">
                <span className="text-sm">Platební metoda</span>
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
        </div>
      </div>
      <div className="container text-gray-500">
        <div className="flex items-center justify-between py-5 font-semibold text-gray-900">
          <span>Celkově</span>
          <span className={clsx(transitionIsHappening ? 'blur-sm' : '')}>
            {formatPrice(
              orderGetTotalPrice({
                deliveryMethodPrice: deliveryMethodPrice.formatted,
                paymentMethodPrice: selectedPaymentMethodPrice,
                subtotal: subtotal,
                discount: totalDiscount,
              }),
            )}
          </span>
        </div>
      </div>
      {formState.errors.root ? (
        <div className="container mb-5">
          <Alert color="error" heading="Stala se obecná chyba">
            {formState.errors.root.message}
          </Alert>
        </div>
      ) : null}
    </>
  );
};
