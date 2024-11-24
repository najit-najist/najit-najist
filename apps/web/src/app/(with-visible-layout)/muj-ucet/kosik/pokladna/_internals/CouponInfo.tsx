'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { Alert, Button, Input } from '@najit-najist/ui';
import { formatPrice } from '@utils';
import { getUserCart, GetUserCartOutput } from '@utils/getUserCart';
import { useRouter } from 'next/navigation';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  ReactNode,
  useState,
  useTransition,
} from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { toggleCouponAction } from '../toggleCouponAction';

export type CouponInfoProps = {
  cartCupon: NonNullable<GetUserCartOutput>['coupon'];
};

const isEnterKeyEvent = (
  event: Parameters<KeyboardEventHandler<HTMLInputElement>>[0],
) => event.key === 'Enter';

export function CouponInfo({
  cartCupon: selectedCoupon,
}: CouponInfoProps): ReactNode {
  const { formState, setError, clearErrors } = useFormContext();
  const [isReloading, startReloading] = useTransition();
  const [inputValue, setInputValue] = useState('');

  const router = useRouter();
  const patch = selectedCoupon?.patches[0];

  const tryToggleCoupon = () => {
    clearErrors();
    startReloading(async () => {
      const result: { errors?: Record<string, FieldError> } =
        (await toggleCouponAction({
          name: inputValue,
        })) || {};

      if ('errors' in result) {
        for (const key in result.errors) {
          setError(key, result.errors[key]);
        }
      } else {
        router.refresh();
        setInputValue('');
      }
    });
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (isEnterKeyEvent(event)) {
      event.preventDefault();
      tryToggleCoupon();
    }
  };

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setInputValue(event.target.value);

  const reductions: string[] = [];

  if (patch?.reductionPercentage) {
    reductions.push(`${patch?.reductionPercentage}%`);
  }
  if (patch?.reductionPrice) {
    reductions.push(formatPrice(patch?.reductionPrice));
  }

  const shouldBeGrouped =
    !!selectedCoupon?.onlyForProductCategories.length ||
    !!selectedCoupon?.onlyForProducts.length;

  const minimalProductCount = selectedCoupon?.minimalProductCount;

  return (
    <div className="px-4">
      <div className="pt-3 flex gap-2">
        <Input
          label="Kupón"
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          value={
            selectedCoupon
              ? `${selectedCoupon.name}${
                  reductions.length ? ` -(${reductions.join(' + ')})` : ''
                }`
              : inputValue
          }
          placeholder="Zde zadejte kupón a aktivujte"
          rootClassName="w-full"
          disabled={isReloading || !!selectedCoupon}
          error={
            formState.errors.root ||
            formState.errors.name?.message ||
            formState.errors.couponId?.message
              ? {
                  message:
                    formState.errors.root?.message ??
                    (formState.errors.name as FieldError | undefined)
                      ?.message ??
                    formState.errors.couponId?.message?.toString() ??
                    'Stala se neočekávaná chyba',
                  type: 'value',
                }
              : undefined
          }
        />
        <div className="flex-none pt-6">
          <Button
            className="h-10 !px-4"
            color={selectedCoupon ? 'red' : undefined}
            isLoading={isReloading}
            onClick={tryToggleCoupon}
          >
            {selectedCoupon ? 'Deaktivovat' : 'Aktivovat'}
          </Button>
        </div>
      </div>
      {shouldBeGrouped || !!minimalProductCount ? (
        <Alert
          color="warning"
          icon={ExclamationTriangleIcon}
          heading={'Vybraný kupón má omezení'}
          className="mt-2"
        >
          Vybraný kupón je uplatnitelný pouze pokud máte{' '}
          {[
            shouldBeGrouped && 'potřebné produkty',
            minimalProductCount &&
              `dostatečný počet potřebných produktů (min. ${minimalProductCount} ks)`,
          ]
            .filter(Boolean)
            .join(' a ')}{' '}
          v košíku.
        </Alert>
      ) : null}
    </div>
  );
}
