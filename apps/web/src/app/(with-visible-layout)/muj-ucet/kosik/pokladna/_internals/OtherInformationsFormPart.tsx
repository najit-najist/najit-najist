'use client';

import { Textarea } from '@components/common/form/Textarea';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormValues } from './types';

export const OtherInformationsFormPart: FC = () => {
  const { isActive } = useReactTransitionContext();
  const { formState, register } = useFormContext<FormValues>();
  const fieldsAreDisabled = formState.isSubmitting || isActive;

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        disabled={fieldsAreDisabled}
        label="Poznámky"
        rows={8}
        {...register('notes')}
      />
    </div>
  );
};
