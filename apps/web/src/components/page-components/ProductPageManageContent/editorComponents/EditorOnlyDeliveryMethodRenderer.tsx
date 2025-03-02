'use client';

import { OrderDeliveryMethod } from '@najit-najist/database/models';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { ProductFormData } from '../_types';
import { OnlyDeliveryMethodBadge } from './OnlyDeliveryMethodBadge';

export const EditorOnlyDeliveryMethodRenderer: FC<{
  deliveryMethods: Record<OrderDeliveryMethod['slug'], OrderDeliveryMethod>;
}> = ({ deliveryMethods }) => {
  const { control } = useFormContext<ProductFormData>();
  const pickedDeliveryMethod = useWatch({
    name: 'toDeliveryMethods',
    control,
  });

  const asKeys = pickedDeliveryMethod
    ? Object.entries(pickedDeliveryMethod)
        .filter(([, enabled]) => enabled)
        .map(([slug]) => slug as OrderDeliveryMethod['slug'])
    : null;
  if (!asKeys?.length) {
    return null;
  }

  return (
    <OnlyDeliveryMethodBadge
      onlyDeliveryMethods={asKeys.map((slug) =>
        deliveryMethods[slug]!.name.toLowerCase(),
      )}
    />
  );
};
