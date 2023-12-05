'use client';

import { TrashIcon } from '@heroicons/react/24/solid';
import { Button } from '@najit-najist/ui';
import { FC } from 'react';

export const CancelOrderButton: FC = () => {
  return (
    <Button
      className="w-full"
      color="red"
      icon={<TrashIcon className="w-4 h-4 inline -mt-1 mr-2" />}
    >
      Zrušit objednávku
    </Button>
  );
};
