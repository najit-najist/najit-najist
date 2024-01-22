'use client';

import { AppRouterOutput, Order, Product } from '@najit-najist/api';
import { Checkbox, CheckboxProps, CheckboxWrapper } from '@najit-najist/ui';
import { isLocalPickup } from '@utils';
import { FC, useMemo } from 'react';
import { useController } from 'react-hook-form';

export const AvailibilityEdit: FC<{
  deliveryMethods: AppRouterOutput['orders']['deliveryMethods']['get']['many'];
}> = ({ deliveryMethods }) => {
  const localPickup = useMemo(
    () => deliveryMethods.find((d) => isLocalPickup(d)),
    [deliveryMethods]
  );
  if (!localPickup) {
    throw new Error('No local pickup in database');
  }

  const onlyDeliveryMethodsInput = useController<
    Pick<Product, 'onlyDeliveryMethods'>
  >({ name: 'onlyDeliveryMethods' });
  const hasLocalPickupSelected = onlyDeliveryMethodsInput.field.value.includes(
    localPickup?.id
  );

  const handleLocalPickupToggle: CheckboxProps['onChange'] = (event) => {
    const checked = event.target.checked;
    const fieldValue = onlyDeliveryMethodsInput.field.value;

    let newValue = Array.isArray(fieldValue) ? [...fieldValue] : [fieldValue];

    if (checked) {
      newValue.push(localPickup.id);
    } else {
      newValue = newValue.filter((pickupId) => pickupId !== localPickup.id);
    }

    onlyDeliveryMethodsInput.field.onChange(newValue);
    console.log({ newValue });
  };

  return (
    <>
      <h3 className="font-bold font-title">Dostupnost</h3>
      <hr className="h-0.5 bg-gray-100 border-none mt-2 mb-5" />
      <CheckboxWrapper childId="local-pickup-only" title="Pouze osobně">
        <Checkbox
          id="local-pickup-only"
          checked={hasLocalPickupSelected}
          onChange={handleLocalPickupToggle}
          size="md"
        />
      </CheckboxWrapper>
    </>
  );
};
