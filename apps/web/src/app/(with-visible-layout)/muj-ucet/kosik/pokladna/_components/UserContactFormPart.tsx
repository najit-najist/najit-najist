'use client';

import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { AppRouterInput } from '@najit-najist/api';
import {
  Checkbox,
  CheckboxWrapper,
  FormBreak,
  Input,
  inputPrefixSuffixStyles,
} from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const UserContactFormPart: FC = () => {
  const { formState, register } =
    useFormContext<AppRouterInput['profile']['cart']['checkout']>();
  const fieldsAreDisabled = formState.isSubmitting;

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

      <div className="sm:flex gap-4">
        <Input
          required
          rootClassName="w-full"
          label="Ulice"
          autoComplete="street-address"
          error={formState.errors.address?.streetName}
          disabled={fieldsAreDisabled}
          {...register('address.streetName')}
        />
        <Input
          required
          rootClassName="flex-none w-26"
          label="Číslo popisné"
          // autoComplete="email"
          error={formState.errors.address?.houseNumber}
          disabled={fieldsAreDisabled}
          {...register('address.houseNumber')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          required
          label="Město"
          autoComplete="address-level2"
          error={formState.errors.address?.city}
          disabled={fieldsAreDisabled}
          {...register('address.city')}
        />
        <Input
          required
          label="PSČ"
          autoComplete="postal-code"
          error={formState.errors.address?.postalCode}
          disabled={fieldsAreDisabled}
          {...register('address.postalCode')}
        />
      </div>
      <MunicipalitySelect label="Kraj" name="address.municipality" required />

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
    </div>
  );
};
