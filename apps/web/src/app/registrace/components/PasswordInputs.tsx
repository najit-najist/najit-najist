import { PasswordInput } from '@najit-najist/ui';
import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { getPasswordStrength, PasswordStrength } from '@najit-najist/api';
import { FormValues } from '../types/FormValues';
import clsx from 'clsx';

const passwordStrengths = [
  PasswordStrength.BAD,
  PasswordStrength.NORMAL,
  PasswordStrength.GOOD,
  PasswordStrength.BEST,
];

const passwordStrengthToColor = {
  [PasswordStrength.BAD]: 'bg-red-600',
  [PasswordStrength.NORMAL]: 'bg-orange-400',
  [PasswordStrength.GOOD]: 'bg-yellow-400',
  [PasswordStrength.BEST]: 'bg-green-400',
};

const PasswordStrengthMeter: FC = () => {
  const { watch } = useFormContext<FormValues>();
  const passwordValue = watch('password');
  const passwordStrength = useMemo(
    () => (passwordValue ? getPasswordStrength(passwordValue) : undefined),
    [passwordValue]
  );
  const maxItemsShown = passwordStrengths.findIndex(
    (value) => value === passwordStrength?.score
  );

  return passwordValue && passwordStrength ? (
    <div className="flex gap-2 mt-2.5">
      {passwordStrengths.map((key, index) => (
        <div
          key={key}
          className={clsx([
            'h-1 w-full rounded-md duration-300 transition-all',
            maxItemsShown < index
              ? 'bg-gray-200'
              : passwordStrengthToColor[passwordStrength.score],
            ,
          ])}
        />
      ))}
    </div>
  ) : null;
};

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
        <PasswordStrengthMeter />
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
