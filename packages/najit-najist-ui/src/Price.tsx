import { VariantProps, cva, cx } from 'class-variance-authority';
import { ClassValue } from 'clsx';
import { FC } from 'react';

export enum CurrencyCodes {
  'CZK' = 'czk',
  'EUR' = 'eur',
}

export const currencyCodeToLabel: Record<CurrencyCodes, string> = {
  [CurrencyCodes.CZK]: 'Kč',
  [CurrencyCodes.EUR]: 'eur',
};

export type PriceSizes = 'xs' | 'sm' | 'default' | 'md';
type SharedValues = {
  size: Record<PriceSizes, ClassValue>;
};

export const priceRootStyles = cva<SharedValues>(
  'text-project-primary font-bold',
  {
    variants: {
      size: { sm: '', xs: '', default: 'text-3xl', md: 'text-5xl' },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);
export const priceValueStyles = cva('tracking-wider');
export const priceCurrencyStyles = cva<SharedValues>(
  'overline text-gray-600 inline-block',
  {
    variants: {
      size: {
        sm: '',
        xs: '',
        default: 'tracking-[-0.1rem] text-lg ml-1 -translate-y-1/4',
        md: 'tracking-[-0.1rem] text-2xl ml-1 -translate-y-1/3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export const Price: FC<
  {
    value: string | number;
    currencyCode?: CurrencyCodes;
    className?: string;
  } & VariantProps<typeof priceRootStyles>
> = ({ value, currencyCode = CurrencyCodes.CZK, className, size }) => {
  return (
    <div className={priceRootStyles({ size, className })}>
      <span className={priceValueStyles()}>{value}</span>
      <span className={priceCurrencyStyles({ size })}>
        {currencyCodeToLabel[currencyCode]}
      </span>
    </div>
  );
};
