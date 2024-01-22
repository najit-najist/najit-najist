'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { OrderPaymentMethod } from '@najit-najist/api';
import { ErrorMessage, RadioGroup } from '@najit-najist/ui';
import { FC, useMemo } from 'react';
import { useController, useFormState, useWatch } from 'react-hook-form';

export const PaymentMethodFormPart: FC<{
  paymentMethods: OrderPaymentMethod[];
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
      paymentMethods.filter(
        (item) => !item.except_delivery_methods.includes(selectedDeliveryId)
      ),
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
