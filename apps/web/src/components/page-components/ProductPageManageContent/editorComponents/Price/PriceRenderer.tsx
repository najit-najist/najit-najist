import { ProductPrice } from '@najit-najist/api';
import { FC } from 'react';

export const PriceRenderer: FC<{ price: ProductPrice }> = ({ price }) => {
  return (
    <div className="text-6xl font-semibold my-10">
      <span className="tracking-wider text-deep-green-400">{price.value}</span>{' '}
      <span className="text-3xl tracking-[-0.1rem] -ml-2 text-gray-700 underline">
        Kč
      </span>
    </div>
  );
};
