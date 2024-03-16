'use client';

import { ProductWithRelationsLocal } from '@custom-types';
import { OrderDeliveryMethod } from '@najit-najist/database/models';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';

import { OnlyDeliveryMethodBadge } from './OnlyDeliveryMethodBadge';

export const EditorOnlyDeliveryMethodRenderer: FC<{
  deliveryMethods: Record<OrderDeliveryMethod['id'], OrderDeliveryMethod>;
}> = ({ deliveryMethods }) => {
  const pickedDeliveryMethod = useWatch<
    Pick<ProductWithRelationsLocal, 'onlyForDeliveryMethod'>
  >({
    name: 'onlyForDeliveryMethod',
  }) as { id: number | null } | null;

  if (!pickedDeliveryMethod?.id) {
    return null;
  }

  return (
    <OnlyDeliveryMethodBadge
      onlyDeliveryMethods={[
        deliveryMethods[pickedDeliveryMethod.id].name.toLowerCase(),
      ]}
    />
  );
};
