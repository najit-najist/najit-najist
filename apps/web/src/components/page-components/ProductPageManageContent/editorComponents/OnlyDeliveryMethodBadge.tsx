import { Badge } from '@components/common/Badge';
import { TruckIcon } from '@heroicons/react/24/solid';
import { FC } from 'react';

export const OnlyDeliveryMethodBadge: FC<{ onlyDeliveryMethods: string[] }> = ({
  onlyDeliveryMethods,
}) => {
  return (
    <Badge size="lg" color="yellow">
      <TruckIcon className="w-4 h-4" />
      Pouze {onlyDeliveryMethods.join(' nebo ')}
    </Badge>
  );
};
