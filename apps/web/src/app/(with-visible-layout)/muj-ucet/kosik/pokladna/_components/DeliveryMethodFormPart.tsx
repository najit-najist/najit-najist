'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import {
  DeliveryMethod,
  OrderPaymentMethod,
  UserCartProduct,
} from '@najit-najist/api';
import {
  Alert,
  ErrorMessage,
  RadioGroup,
  RadioGroupItem,
  RadioGroupProps,
} from '@najit-najist/ui';
import { FC, useCallback, useMemo } from 'react';
import { useController, useFormContext, useFormState } from 'react-hook-form';

export const DeliveryMethodFormPart: FC<{
  deliveryMethods: DeliveryMethod[];
  paymentMethods: OrderPaymentMethod[];
  localPickupOnlyProducts?: UserCartProduct[];
}> = ({ deliveryMethods, paymentMethods, localPickupOnlyProducts }) => {
  const formState = useFormState();
  const { setValue, getValues } = useFormContext();
  const controller = useController({
    name: 'deliveryMethod',
  });

  const userHasLocalPickupProductsInCart = !!localPickupOnlyProducts?.length;

  // Setup for quick access
  const paymentMethodsForDeliveryId = useMemo(() => {
    const result: Record<DeliveryMethod['id'], OrderPaymentMethod[]> = {};

    for (const deliveryMethod of deliveryMethods) {
      result[deliveryMethod.id] = paymentMethods.filter(
        (item) => !item.except_delivery_methods.includes(deliveryMethod.id)
      );
    }

    return result;
  }, [paymentMethods, deliveryMethods]);

  const handleChange = useCallback<
    NonNullable<RadioGroupProps<DeliveryMethod>['onChange']>
  >(
    (nextItem) => {
      const { onChange } = controller.field;

      onChange(nextItem);

      const values = getValues();

      // Check if previously set payment method is valid. If not then fallback to first of new set of payment methods
      if (
        values.paymentMethod &&
        !paymentMethodsForDeliveryId[nextItem.id].find(
          (paymentMethod) => paymentMethod.id === values.paymentMethod.id
        )
      ) {
        setValue(
          'paymentMethod',
          paymentMethodsForDeliveryId[nextItem.id].at(0)
        );
      }
    },
    [controller.field, getValues, paymentMethodsForDeliveryId, setValue]
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
        itemsWrapperClassName="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-5"
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
