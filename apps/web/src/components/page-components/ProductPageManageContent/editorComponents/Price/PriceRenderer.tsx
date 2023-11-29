import { ProductPrice } from '@najit-najist/api';
import { FC } from 'react';

// TODO - perhaps make this a component from this
export const PriceRenderer: FC<{ price: ProductPrice }> = ({ price }) => {
  return (
    <div className="text-6xl font-semibold">
      <span className="tracking-wider text-project-primary">{price.value}</span>{' '}
      <span className="text-3xl tracking-[-0.1rem] -ml-2 text-gray-700 underline">
        Kč
      </span>
    </div>
  );
};
