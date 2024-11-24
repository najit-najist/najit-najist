'use client';

import { Button } from '@najit-najist/ui';
import { useFormContext } from 'react-hook-form';

export const SaveButton = () => {
  const { formState } = useFormContext();

  return (
    <Button isLoading={formState.isSubmitting} type="submit" appearance="small">
      Uložit
    </Button>
  );
};
