'use client';

import { Alert } from '@components/common/Alert';
import { Tooltip } from '@components/common/Tooltip';
import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { FormBreak } from '@components/common/form/FormBreak';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { OrderPaymentMethodWithRelations } from '@custom-types';
import {
  Description,
  Label,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon as ExclamationTriangleIconSolid } from '@heroicons/react/24/solid';
import {
  OrderDeliveryMethod,
  OrderDeliveryMethodsSlug,
} from '@najit-najist/database/models';
import { cx } from 'class-variance-authority';
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
    NonNullable<RadioGroupProps<'div', OrderDeliveryMethod>['onChange']>
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
  const disabled = formState.isSubmitting || isActive;
  const hasDisabledItems = !!deliveryMethods.some((d) => d.disabled);

  return (
    <>
      <FormBreak
        label={
          <>
            {hasDisabledItems ? (
              <Tooltip
                placement="top-start"
                color="warning"
                trigger={
                  <ExclamationTriangleIconSolid className="mr-3 w-4.5 h-4.5 inline text-orange-500" />
                }
              >
                <div className="px-2 py-3 text-sm max-w-sm text-yellow-700">
                  <p className="font-semibold">
                    <ExclamationTriangleIcon className="w-4 h-4 inline" /> Pouze{' '}
                    {disabledOnlyDeliveryMethods
                      .map((d) => d.name.toLowerCase())
                      .join(', ')}
                    !
                  </p>
                  <p className="text-sm mt-2">
                    Váš košík obsahuje produkty, které mají omezení na dopravu a
                    proto nemusíte mít dostupné všechny možnosti dopravy.
                  </p>
                </div>
              </Tooltip>
            ) : null}
            Doručovací metoda
          </>
        }
        className="mt-12 mb-6"
      />

      <RadioGroup
        as="div"
        by="slug"
        value={fieldValue}
        onChange={handleChange}
        onBlur={controller.field.onBlur}
        disabled={disabled}
      >
        <div className="grid grid-cols-1 gap-8">
          {deliveryMethods.map((item) => (
            <Radio
              key={item.name}
              value={item}
              disabled={disabled || item.disabled}
              className={({ disabled }) =>
                cx('flex w-full items-start', disabled ? 'opacity-50' : '')
              }
            >
              {({ checked, focus, disabled }) => (
                <>
                  <div
                    className={cx(
                      'duration-200 flex-none mr-2 -bottom-[1px] relative flex h-4.5 w-4.5 rounded-full border-2',
                      disabled ? 'bg-gray-100' : 'bg-white',
                      checked ? 'border-project-primary' : 'border-project',
                    )}
                  >
                    <div
                      className={cx(
                        'h-2 w-2 rounded-full top-1 left-1 bg-project-primary m-auto duration-200',
                        checked ? 'opacity-100' : 'opacity-0',
                        focus ? '!bg-project-primary/50 opacity-100' : '',
                      )}
                    />
                  </div>
                  <div className="flex items-center w-full">
                    <div className="text-sm pl-1 w-full">
                      <Label
                        as="p"
                        className={cx(
                          'font-medium text-gray-900 text-lg -mt-1',
                          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                        )}
                      >
                        {item.name}{' '}
                        {disabled ? (
                          <span className="text-sm text-orange-500">
                            {' '}
                            - pro tuto objednávku nedostupné
                          </span>
                        ) : null}
                      </Label>
                      <Description as="div">
                        {item.description ? (
                          <div className="mt-1 block text-gray-500">
                            {item.description}
                          </div>
                        ) : null}

                        {checked ? (
                          <>
                            {item.slug ===
                            OrderDeliveryMethodsSlug.LOCAL_PICKUP ? (
                              <div className="mt-2 w-full">
                                <LocalPickupDeliveryTimePicker />
                              </div>
                            ) : null}
                            {item.slug === OrderDeliveryMethodsSlug.PACKETA ? (
                              <div className="mt-2 w-full">
                                <PacketaPickupDelivery />
                              </div>
                            ) : null}
                          </>
                        ) : null}
                      </Description>
                    </div>
                  </div>
                </>
              )}
            </Radio>
          ))}
        </div>
      </RadioGroup>

      {controller.fieldState.error?.message ? (
        <ErrorMessage>{controller.fieldState.error?.message}</ErrorMessage>
      ) : null}
    </>
  );
};
