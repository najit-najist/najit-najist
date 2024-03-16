'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { OrderPaymentMethodWithRelations } from '@custom-types';
import { PaymentMethodsSlug } from '@najit-najist/pb';
import { ErrorMessage, RadioGroup } from '@najit-najist/ui';
import Image from 'next/image';
import { FC, useMemo } from 'react';
import { useController, useFormState, useWatch } from 'react-hook-form';

export const PaymentMethodFormPart: FC<{
  paymentMethods: OrderPaymentMethodWithRelations[];
}> = ({ paymentMethods }) => {
  const { isActive } = useReactTransitionContext();
  const formState = useFormState();
  const selectedDeliveryId = useWatch({
    name: 'deliveryMethod.id',
  });

  const controller = useController({
    name: 'paymentMethod',
  });

  const filteredPaymentMethods = useMemo(
    () =>
      paymentMethods
        .filter(
          (item) =>
            !item.exceptDeliveryMethods
              .map(({ id }) => id)
              .includes(selectedDeliveryId)
        )
        .map((item) => ({
          ...item,
          ...(item.slug === PaymentMethodsSlug.BY_CARD
            ? {
                description: (
                  <>
                    <p>{item.description}</p>

                    <a
                      href="https://www.comgate.cz/"
                      className="mt-3 inline-block p-1.5 bg-white rounded-lg shadow-lg border border-gray-100"
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
                ),
              }
            : {}),
        })),
    [paymentMethods, selectedDeliveryId]
  );

  if (!paymentMethods.length) {
    return null;
  }

  return (
    <>
      <RadioGroup
        by="id"
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
