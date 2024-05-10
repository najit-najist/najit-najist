'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import clsx from 'clsx';
import { FC } from 'react';

export const PriceList: FC<{ price: { total: number } }> = ({ price }) => {
  const { isActive: transitionIsHappening } = useReactTransitionContext();

  return (
    <div className="px-4 text-gray-500">
      <div className={'flex items-center justify-between py-5'}>
        <span>Mezisoučet</span>
        <span
          className={clsx(
            'text-gray-900',
            transitionIsHappening ? 'blur-sm' : ''
          )}
        >
          {price.total} Kč
        </span>
      </div>
      <hr />
      <div className="flex items-center justify-between py-5 font-semibold text-gray-900">
        <span>Celkově</span>
        <span className={clsx(transitionIsHappening ? 'blur-sm' : '')}>
          {price.total} Kč
        </span>
      </div>
    </div>
  );
};
