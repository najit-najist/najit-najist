import { PasswordStrengthMeter } from '@components/common/PasswordStrengthMeter';
import { PasswordInput } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormValues } from '../_types/FormValues';

export const PasswordInputs: FC = () => {
  const { formState, register } = useFormContext<FormValues>();

  const fieldsAreDisabled =
    formState.isSubmitting || formState.isSubmitSuccessful;

  return (
    <>
      <div>
        <PasswordInput
          required
          label="Heslo"
          id="password"
          autoComplete="new-password"
          error={formState.errors.password}
          disabled={fieldsAreDisabled}
          {...register('password')}
        />
        <PasswordStrengthMeter fieldName="password" />
      </div>

      <PasswordInput
        required
        label="Heslo znovu"
        id="password-again"
        autoComplete="new-password"
        error={formState.errors.passwordAgain}
        disabled={fieldsAreDisabled}
        {...register('passwordAgain')}
      />
    </>
  );
};
