'use client';

import { Checkbox } from '@components/common/form/Checkbox';
import { CheckboxWrapper } from '@components/common/form/CheckboxWrapper';
import { AppRouterOutput } from '@custom-types';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProductFormData } from '../_types';

export const AvailibilityEdit: FC<{
  deliveryMethods: AppRouterOutput['orders']['deliveryMethods']['get']['many'];
}> = ({ deliveryMethods }) => {
  const { register } = useFormContext<ProductFormData>();

  return (
    <div className="grid grid-cols-1 gap-2">
      {Object.values(deliveryMethods).map((item) => (
        <CheckboxWrapper
          key={item.id}
          childId={`limit-to-${item.slug}`}
          title={`Omezit dopravu na ${item.name}`}
          className="!text-sm"
        >
          <Checkbox
            id={`limit-to-${item.slug}`}
            size="normal"
            {...register(`toDeliveryMethods.${item.slug}`)}
          />
        </CheckboxWrapper>
      ))}
    </div>
  );
};
