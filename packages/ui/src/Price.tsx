import { VariantProps, cva } from 'class-variance-authority';
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

export type PriceSizes = 'xs' | 'sm' | 'default' | 'md' | 'lg';
type SharedValues = {
  size: Record<PriceSizes, ClassValue>;
};

export const priceRootStyles = cva('text-project-primary font-bold', {
  variants: {
    size: {
      sm: '',
      xs: 'text-sm',
      default: 'text-3xl',
      md: 'text-5xl',
      lg: 'text-6xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
export const priceValueStyles = cva('tracking-widest');
export const priceCurrencyStyles = cva('overline text-gray-500 inline-block', {
  variants: {
    size: {
      sm: 'ml-0.5 -translate-y-[0.2rem] text-[12px]',
      xs: 'ml-0.5 -translate-y-[0.2rem] text-[12px]',
      default: 'tracking-[-0.1rem] text-lg ml-1 -translate-y-[0.5rem]',
      md: 'tracking-[-0.1rem] text-2xl ml-1 -translate-y-[1rem]',
      lg: 'tracking-[-0.1rem] text-3xl ml-1 -translate-y-[1.3rem]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const Price: FC<
  {
    value: string | number;
    currencyCode?: CurrencyCodes;
    className?: string;
    discount?: number;
  } & VariantProps<typeof priceRootStyles>
> = ({ value, currencyCode = CurrencyCodes.CZK, className, size }) => {
  return (
    <div className={priceRootStyles({ size, className })}>
      {value ? (
        <>
          <span className={priceValueStyles()}>{value}</span>
          <span className={priceCurrencyStyles({ size })}>
            {currencyCodeToLabel[currencyCode]}
          </span>
        </>
      ) : (
        <p className={priceValueStyles()}>Zdarma</p>
      )}
    </div>
  );
};
