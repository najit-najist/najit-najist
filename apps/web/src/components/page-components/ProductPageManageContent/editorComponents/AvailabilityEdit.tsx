'use client';

import { Checkbox, CheckboxProps } from '@components/common/form/Checkbox';
import { CheckboxWrapper } from '@components/common/form/CheckboxWrapper';
import { AppRouterOutput, ProductWithRelationsLocal } from '@custom-types';
import { OrderDeliveryMethod } from '@najit-najist/database/models';
import { isLocalPickup } from '@utils';
import { FC, useMemo } from 'react';
import { useController } from 'react-hook-form';

export const AvailibilityEdit: FC<{
  deliveryMethods: AppRouterOutput['orders']['deliveryMethods']['get']['many'];
}> = ({ deliveryMethods }) => {
  const localPickup = useMemo(
    () => deliveryMethods.find((d) => isLocalPickup(d)),
    [deliveryMethods],
  );
  if (!localPickup) {
    throw new Error('No local pickup in database');
  }

  const onlyForDeliveryMethodInput = useController<
    Pick<ProductWithRelationsLocal, 'onlyForDeliveryMethod'>
  >({ name: 'onlyForDeliveryMethod' });
  const onlyForDeliveryMethodValue = onlyForDeliveryMethodInput.field
    .value as null | OrderDeliveryMethod;

  const hasLocalPickupSelected =
    onlyForDeliveryMethodValue?.id === localPickup?.id;

  const handleLocalPickupToggle: CheckboxProps['onChange'] = (event) => {
    const checked = event.target.checked;

    onlyForDeliveryMethodInput.field.onChange(checked ? localPickup : null);
  };

  return (
    <>
      <CheckboxWrapper
        childId="local-pickup-only"
        title="Pouze osobně"
        className="font-title !text-base"
      >
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
