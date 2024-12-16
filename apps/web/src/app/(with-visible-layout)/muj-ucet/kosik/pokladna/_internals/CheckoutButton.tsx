'use client';

import { Button } from '@components/common/Button';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const CheckoutButton: FC = () => {
  const { isActive } = useReactTransitionContext();
  const { formState } = useFormContext();
  const paymentMethod = useWatch({
    name: 'paymentMethod',
  });

  const isDisabled = isActive || formState.isSubmitting;
  const buttonText = isDisabled
    ? 'Pracuji...'
    : paymentMethod.payment_on_checkout
      ? 'Odeslat a zaplatit'
      : 'Odeslat';

  return (
    <Button
      className="ml-auto mr-2 sm:mr-auto sm:w-48"
      disabled={isDisabled}
      isLoading={isDisabled}
      type="submit"
    >
      {buttonText}
    </Button>
  );
};
