'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { DeliveryMethod, UserCartProduct } from '@najit-najist/api';
import {
  Alert,
  ErrorMessage,
  RadioGroup,
  RadioGroupItem,
  RadioGroupProps,
} from '@najit-najist/ui';
import { FC, useCallback } from 'react';
import { useController, useFormContext, useFormState } from 'react-hook-form';

export const DeliveryMethodFormPart: FC<{
  deliveryMethods: DeliveryMethod[];
  localPickupOnlyProducts?: UserCartProduct[];
}> = ({ deliveryMethods, localPickupOnlyProducts }) => {
  const formState = useFormState();
  const { setValue } = useFormContext();
  const controller = useController({
    name: 'deliveryMethod',
  });

  const userHasLocalPickupProductsInCart = !!localPickupOnlyProducts?.length;

  const handleChange = useCallback<
    NonNullable<RadioGroupProps<DeliveryMethod>['onChange']>
  >(
    (nextItem) => {
      const { onChange } = controller.field;

      onChange(nextItem);
      // Update payment method too since every deliveryMethod has its own group of paymentMethods
      setValue('paymentMethod', nextItem.paymentMethods.at(0));
    },
    [controller.field, setValue]
  );

  return (
    <>
      <RadioGroup<DeliveryMethod>
        disabled={userHasLocalPickupProductsInCart || formState.isSubmitting}
        value={controller.field.value}
        onChange={handleChange}
        onBlur={controller.field.onBlur}
        by="id"
        items={deliveryMethods}
        itemsWrapperClassName="flex gap-5"
      />
      {controller.fieldState.error?.message ? (
        <ErrorMessage>{controller.fieldState.error?.message}</ErrorMessage>
      ) : null}
      {userHasLocalPickupProductsInCart ? (
        <Alert
          className="mt-5"
          heading={
            <>
              <ExclamationTriangleIcon className="w-5 h-5 inline" /> Pouze
              osobně!
            </>
          }
          color="warning"
        >
          Váš košík obsahuje produkty, které jsou pouze dostupné na prodejně a
          proto Vám tuto objednávku nemůžeme odeslat poštou.
        </Alert>
      ) : null}
    </>
  );
};
