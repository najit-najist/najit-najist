'use client';

import { Alert } from '@components/common/Alert';
import { ErrorMessage } from '@components/common/form/ErrorMessage';
import {
  RadioGroup,
  RadioGroupProps,
} from '@components/common/form/RadioGroup';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { OrderPaymentMethodWithRelations } from '@custom-types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import {
  OrderDeliveryMethod,
  OrderDeliveryMethodsSlug,
} from '@najit-najist/database/models';
import { FC, useCallback, useMemo } from 'react';
import { useController, useFormContext, useFormState } from 'react-hook-form';

import { LocalPickupDeliveryTimePicker } from './LocalPickupDeliveryTimePicker';
import { PacketaPickupDelivery } from './PacketaPickupDelivery';

export type DeliveryMethodFormPartProps = {
  deliveryMethods: (OrderDeliveryMethod & { disabled?: boolean })[];
  paymentMethods: OrderPaymentMethodWithRelations[];
};

export const DeliveryMethodFormPart: FC<DeliveryMethodFormPartProps> = ({
  deliveryMethods,
  paymentMethods,
}) => {
  const { isActive } = useReactTransitionContext();
  const formState = useFormState();
  const { setValue, getValues } = useFormContext();
  const controller = useController<
    { deliveryMethod: OrderDeliveryMethod },
    'deliveryMethod'
  >({
    name: 'deliveryMethod',
  });

  // Setup for quick access
  const paymentMethodsForDeliveryId = useMemo(() => {
    const result: Record<
      OrderDeliveryMethod['id'],
      OrderPaymentMethodWithRelations[]
    > = {};

    for (const deliveryMethod of deliveryMethods) {
      result[deliveryMethod.id] = paymentMethods.filter(
        (item) =>
          !item.exceptDeliveryMethods
            .map(({ id }) => id)
            .includes(deliveryMethod.id),
      );
    }

    return result;
  }, [paymentMethods, deliveryMethods]);

  const handleChange = useCallback<
    NonNullable<RadioGroupProps<OrderDeliveryMethod>['onChange']>
  >(
    (nextItem) => {
      const { onChange } = controller.field;

      onChange({
        ...nextItem,
        meta: null,
      });

      const values = getValues();

      // Check if previously set payment method is valid. If not then fallback to first of new set of payment methods
      if (
        values.paymentMethod &&
        !paymentMethodsForDeliveryId[nextItem.id].find(
          (paymentMethod) => paymentMethod.id === values.paymentMethod.id,
        )
      ) {
        setValue(
          'paymentMethod',
          paymentMethodsForDeliveryId[nextItem.id].at(0),
        );
      }
    },
    [controller.field, getValues, paymentMethodsForDeliveryId, setValue],
  );
  const disabledOnlyDeliveryMethods = useMemo(
    () => deliveryMethods.filter((d) => !d.disabled),
    [deliveryMethods],
  );
  const fieldValue = controller.field.value;

  return (
    <>
      <RadioGroup<OrderDeliveryMethod>
        by="slug"
        disabled={formState.isSubmitting || isActive}
        value={fieldValue}
        onChange={handleChange}
        onBlur={controller.field.onBlur}
        items={deliveryMethods}
        itemsWrapperClassName="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3"
      />
      {controller.fieldState.error?.message ? (
        <ErrorMessage>{controller.fieldState.error?.message}</ErrorMessage>
      ) : null}
      {fieldValue.slug === OrderDeliveryMethodsSlug.LOCAL_PICKUP ? (
        <LocalPickupDeliveryTimePicker />
      ) : null}
      {fieldValue.slug === OrderDeliveryMethodsSlug.PACKETA ? (
        <PacketaPickupDelivery />
      ) : null}
      {deliveryMethods.filter((d) => d.disabled).length ? (
        <Alert
          className="mt-5"
          heading={
            <>
              <ExclamationTriangleIcon className="w-4 h-4 inline" /> Pouze{' '}
              {disabledOnlyDeliveryMethods
                .map((d) => d.name.toLowerCase())
                .join(', ')}
              !
            </>
          }
          color="warning"
        >
          Váš košík obsahuje produkty, které mají omezení na dopravu a proto
          nemusíte mít dostupné všechny možnosti dopravy.
        </Alert>
      ) : null}
    </>
  );
};
