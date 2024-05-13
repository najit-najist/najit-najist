'use client';

import { AddressFields } from '@components/page-components/EditUserUnderpage/AddressFields';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { AppRouterInput } from '@najit-najist/api';
import {
  Checkbox,
  CheckboxWrapper,
  FormBreak,
  Input,
  Textarea,
  inputPrefixSuffixStyles,
} from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormValues } from './types';

export const UserContactFormPart: FC = () => {
  const { isActive } = useReactTransitionContext();
  const { formState, register } = useFormContext<FormValues>();
  const fieldsAreDisabled = formState.isSubmitting || isActive;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          required
          label="Jméno"
          id="firstName"
          type="string"
          autoComplete="given-name"
          error={formState.errors.firstName}
          disabled={fieldsAreDisabled}
          {...register('firstName')}
        />
        <Input
          required
          label="Příjmení"
          id="lastName"
          type="string"
          autoComplete="family-name"
          error={formState.errors.lastName}
          disabled={fieldsAreDisabled}
          {...register('lastName')}
        />
      </div>

      <FormBreak className="mt-5 mb-2" />

      <Input
        required
        label="Emailová adresa"
        id="email"
        type="email"
        autoComplete="email"
        error={formState.errors.email}
        disabled={fieldsAreDisabled}
        {...register('email')}
      />

      <Input
        required
        label="Telefonní číslo"
        id="telephoneNumber"
        type="string"
        autoComplete="tel-national"
        prefix={
          <span
            className={inputPrefixSuffixStyles({
              type: 'prefix',
              className: 'px-2 flex items-center justify-center',
            })}
          >
            +420
          </span>
        }
        inputMode="numeric"
        error={formState.errors.telephoneNumber}
        disabled={fieldsAreDisabled}
        {...register('telephoneNumber')}
      />

      <FormBreak className="mt-5 mb-2" />

      <AddressFields required />

      <CheckboxWrapper
        childId="save-current-address"
        title="Uložit adresu na příště"
      >
        <Checkbox
          id="save-current-address"
          disabled={fieldsAreDisabled}
          {...register('saveAddressToAccount')}
        />
      </CheckboxWrapper>

      <FormBreak className="mt-4 mb-2" />

      <Textarea
        disabled={fieldsAreDisabled}
        label="Poznámky"
        rows={8}
        {...register('notes')}
      />
    </div>
  );
};
