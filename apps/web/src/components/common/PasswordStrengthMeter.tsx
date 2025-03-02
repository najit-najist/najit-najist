'use client';

import { PasswordStrength, getPasswordStrength } from '@najit-najist/security';
import clsx from 'clsx';
import { FC, useMemo } from 'react';
import { Control, useWatch } from 'react-hook-form';

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

export const PasswordStrengthMeter: FC<{
  fieldName: string;
  control?: Control<any>;
}> = ({ fieldName, control }) => {
  const passwordValue = useWatch({ name: fieldName, control });
  const passwordStrength = useMemo(
    () => (passwordValue ? getPasswordStrength(passwordValue) : undefined),
    [passwordValue],
  );
  const maxItemsShown = passwordStrengths.findIndex(
    (value) => value === passwordStrength?.score,
  );

  return passwordValue && passwordStrength ? (
    <div className="flex gap-2 mt-2.5">
      {passwordStrengths.map((key, index) => (
        <div
          key={key}
          className={clsx([
            'h-1 w-full rounded-project duration-300 transition-all',
            maxItemsShown < index
              ? 'bg-gray-100'
              : passwordStrengthToColor[passwordStrength.score],
            ,
          ])}
        />
      ))}
    </div>
  ) : null;
};
