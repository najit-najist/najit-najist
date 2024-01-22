'use client';

import { DeliveryMethod, Product } from '@najit-najist/api';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';

import { OnlyDeliveryMethodBadge } from './OnlyDeliveryMethodBadge';

export const EditorOnlyDeliveryMethodRenderer: FC<{
  deliveryMethods: Record<DeliveryMethod['id'], DeliveryMethod>;
}> = ({ deliveryMethods }) => {
  const onlyDeliveryMethods = useWatch<Pick<Product, 'onlyDeliveryMethods'>>({
    name: 'onlyDeliveryMethods',
  }) as string[];

  if (!onlyDeliveryMethods.length) {
    return null;
  }

  return (
    <OnlyDeliveryMethodBadge
      onlyDeliveryMethods={onlyDeliveryMethods
        .filter((dId) => dId in deliveryMethods)
        .map((deliveryMethodId) =>
          deliveryMethods[deliveryMethodId].name.toLowerCase()
        )}
    />
  );
};
