'use client';

import { DeliveryMethod } from '@najit-najist/api';
import { ErrorMessage, RadioGroup } from '@najit-najist/ui';
import { FC, useMemo } from 'react';
import { useController, useFormState, useWatch } from 'react-hook-form';

export const PaymentMethodFormPart: FC<{
  deliveryMethods: DeliveryMethod[];
}> = ({ deliveryMethods }) => {
  const formState = useFormState();
  const selectedDeliveryId = useWatch({
    name: 'deliveryMethod.id',
  });

  const controller = useController({
    name: 'paymentMethod',
  });

  const paymentMethodsForDeliveryMethodIds = useMemo(
    () =>
      Object.fromEntries(
        deliveryMethods?.map((item) => [item.id, item.paymentMethods])
      ),
    [deliveryMethods]
  );
  const paymentMethods =
    paymentMethodsForDeliveryMethodIds[selectedDeliveryId] ?? [];

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
        items={paymentMethods}
        itemsWrapperClassName="flex gap-5"
        disabled={formState.isSubmitting}
      />
      {controller.fieldState.error?.message ? (
        <ErrorMessage>{controller.fieldState.error?.message}</ErrorMessage>
      ) : null}
    </>
  );
};
