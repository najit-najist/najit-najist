'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Alert, Button, Input } from '@najit-najist/ui';
import { useMutation } from '@tanstack/react-query';
import { getUserCart } from '@utils/getUserCart';
import { useRouter } from 'next/navigation';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  ReactNode,
  useState,
  useTransition,
} from 'react';
import { useFormContext } from 'react-hook-form';

import { toggleCouponAction } from '../toggleCouponAction';

export type CouponInfoProps = {
  cartCupon: Awaited<ReturnType<typeof getUserCart>>['coupon'];
};

const isEnterKeyEvent = (
  event: Parameters<KeyboardEventHandler<HTMLInputElement>>[0]
) => event.key === 'Enter';

export function CouponInfo({
  cartCupon: selectedCoupon,
}: CouponInfoProps): ReactNode {
  const { formState } = useFormContext();
  const [isReloading, startReloading] = useTransition();
  const [inputValue, setInputValue] = useState('');
  const {
    mutate: toggleCoupon,
    data,
    isLoading,
  } = useMutation({
    mutationFn: toggleCouponAction,
  });

  const router = useRouter();
  const patch = selectedCoupon?.patches[0];

  const tryToggleCoupon = () => {
    toggleCoupon(
      {
        name: inputValue,
      },
      {
        onSuccess(result) {
          if ('errors' in (result ?? {}) === false) {
            startReloading(() => {
              router.refresh();
              setInputValue('');
            });
          }
        },
      }
    );
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
    reductions.push(`${patch?.reductionPrice}Kč`);
  }

  const shouldBeGrouped =
    !!selectedCoupon?.onlyForProductCategories.length ||
    !!selectedCoupon?.onlyForProducts.length;

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
          disabled={isLoading || isReloading || !!selectedCoupon}
          error={
            (data && 'errors' in data) || formState.errors.couponId
              ? {
                  message:
                    (data as any)?.errors?.root?.message ??
                    (data as any)?.errors?.name?.message ??
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
            isLoading={isLoading || isReloading}
            onClick={tryToggleCoupon}
          >
            {selectedCoupon ? 'Deaktivovat' : 'Aktivovat'}
          </Button>
        </div>
      </div>
      {shouldBeGrouped ? (
        <Alert
          color="warning"
          icon={InformationCircleIcon}
          heading="Vybraný kupón je platný pouze na vybrané produkty"
          className="mt-2"
        >
          Pokud nemáte potřebné produkty v košíku tak Vám nemusíme slevu
          uplatnit.
        </Alert>
      ) : null}
    </div>
  );
}
