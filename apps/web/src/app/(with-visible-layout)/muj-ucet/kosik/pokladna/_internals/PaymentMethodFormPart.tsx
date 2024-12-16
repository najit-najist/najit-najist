'use client';

import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { RadioGroup } from '@components/common/form/RadioGroup';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { OrderPaymentMethodWithRelations } from '@custom-types';
import {
  OrderDeliveryMethod,
  OrderPaymentMethodsSlugs,
} from '@najit-najist/database/models';
import Image from 'next/image';
import { FC, useMemo } from 'react';
import { useController, useFormState, useWatch } from 'react-hook-form';

export const PaymentMethodFormPart: FC<{
  paymentMethods: OrderPaymentMethodWithRelations[];
}> = ({ paymentMethods }) => {
  const { isActive } = useReactTransitionContext();
  const formState = useFormState();
  const selectedDeliverySlug = useWatch<
    { deliveryMethod: OrderDeliveryMethod },
    'deliveryMethod.slug'
  >({
    name: 'deliveryMethod.slug',
  });

  const controller = useController({
    name: 'paymentMethod',
  });

  const mappedPaymentMethods = useMemo(
    () =>
      paymentMethods.map((item) => {
        if (item.slug === OrderPaymentMethodsSlugs.BY_CARD) {
          item.description = (
            <>
              <p>{item.description}</p>

              <a
                href="https://www.comgate.cz/"
                className="mt-3 inline-block p-1.5 bg-white rounded-project shadow-lg border border-gray-100"
                title="Zprostředkovatel plateb je comgate.cz"
                target="_blank"
              >
                <Image
                  alt="Comgate logo"
                  width={100}
                  height={24}
                  src="https://www.comgate.cz/files/logo-web-280.png"
                />
              </a>
            </>
          ) as unknown as string;
        }

        return item;
      }),
    [paymentMethods],
  );

  const filteredPaymentMethods = useMemo(
    () =>
      mappedPaymentMethods.filter(
        (item) =>
          !item.exceptDeliveryMethods
            .map(({ slug }) => slug)
            .includes(selectedDeliverySlug),
      ),
    [selectedDeliverySlug, mappedPaymentMethods],
  );

  if (!filteredPaymentMethods.length) {
    return null;
  }

  return (
    <>
      <RadioGroup<OrderDeliveryMethod>
        by="slug"
        value={controller.field.value}
        onChange={controller.field.onChange}
        onBlur={controller.field.onBlur}
        items={filteredPaymentMethods}
        itemsWrapperClassName="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3"
        disabled={formState.isSubmitting || isActive}
      />
      {controller.fieldState.error?.message ? (
        <ErrorMessage>{controller.fieldState.error?.message}</ErrorMessage>
      ) : null}
    </>
  );
};
