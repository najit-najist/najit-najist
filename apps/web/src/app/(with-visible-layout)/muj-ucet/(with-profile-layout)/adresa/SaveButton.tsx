'use client';

import { Button } from '@components/common/Button';
import { useFormContext } from 'react-hook-form';

export const SaveButton = () => {
  const { formState } = useFormContext();

  return (
    <Button isLoading={formState.isSubmitting} type="submit" size="sm">
      Uložit
    </Button>
  );
};
