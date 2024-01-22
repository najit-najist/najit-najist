'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { Button } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const CheckoutButton: FC = () => {
  const { isActive } = useReactTransitionContext();
  const { formState } = useFormContext();
  const isDisabled = isActive || formState.isSubmitting;
  const buttonText = isDisabled ? 'Pracuji...' : 'Vytvořit objednávku';

  return (
    <Button
      className="mx-4"
      disabled={isDisabled}
      isLoading={isDisabled}
      type="submit"
    >
      {buttonText}
    </Button>
  );
};
