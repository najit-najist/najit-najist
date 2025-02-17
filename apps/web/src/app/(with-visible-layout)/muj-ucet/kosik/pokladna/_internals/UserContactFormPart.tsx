'use client';

import { Checkbox } from '@components/common/form/Checkbox';
import { CheckboxWrapper } from '@components/common/form/CheckboxWrapper';
import { FormBreak } from '@components/common/form/FormBreak';
import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import { AddressFields } from '@components/page-components/EditUserUnderpage/AddressFields';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { FormValues } from './types';

export const UserContactFormPart: FC = () => {
  const { isActive } = useReactTransitionContext();
  const { formState, register, control, setValue } =
    useFormContext<FormValues>();
  const fieldsAreDisabled = formState.isSubmitting || isActive;

  const invoiceAddress = useWatch({
    name: 'invoiceAddress',
    control,
  });

  const businessInformation = useWatch({
    name: 'businessInformations',
    control,
  });

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

      <Input
        disabled
        required
        label="Emailová adresa"
        id="email"
        type="email"
        autoComplete="email"
        error={formState.errors.email}
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

      <FormBreak
        label={
          invoiceAddress
            ? 'Doručovací adresa'
            : 'Doručovací a fakturační adresa'
        }
        className="mt-9 mb-3"
      />

      <AddressFields
        required
        control={control}
        fieldMap={{
          city: 'address.city',
          country: 'address.city',
          houseNumber: 'address.houseNumber',
          municipality: 'address.municipality',
          postalCode: 'address.postalCode',
          streetName: 'address.streetName',
        }}
      />

      <CheckboxWrapper
        childId="enable-invoice-address"
        title="Fakturační adresa je jiná než doručovací"
      >
        <Checkbox
          id="enable-invoice-address"
          disabled={fieldsAreDisabled}
          checked={!!invoiceAddress}
          onChange={(event) => {
            const nextIsChecked = event.target.checked;

            setValue(
              'invoiceAddress',
              nextIsChecked
                ? {
                    city: '',
                    houseNumber: '',
                    postalCode: '',
                    municipality: { id: null as unknown as number },
                    streetName: '',
                  }
                : undefined,
            );
          }}
        />
      </CheckboxWrapper>

      {invoiceAddress ? (
        <>
          <FormBreak label="Fakturační adresa" className="mt-4 mb-3" />
          <AddressFields
            required
            control={control}
            fieldMap={{
              city: 'invoiceAddress.city',
              country: 'invoiceAddress.city',
              houseNumber: 'invoiceAddress.houseNumber',
              municipality: 'invoiceAddress.municipality',
              postalCode: 'invoiceAddress.postalCode',
              streetName: 'invoiceAddress.streetName',
            }}
          />
          <div className="my-1" />
        </>
      ) : null}

      <CheckboxWrapper
        childId="enable-company-invoice"
        title="Fakturuji na firmu"
      >
        <Checkbox
          id="enable-company-invoice"
          disabled={fieldsAreDisabled}
          checked={!!businessInformation}
          onChange={(event) => {
            const nextIsChecked = event.target.checked;

            setValue(
              'businessInformations',
              nextIsChecked
                ? {
                    ico: '',
                    dic: null,
                  }
                : undefined,
            );
          }}
        />
      </CheckboxWrapper>

      {businessInformation ? (
        <>
          <FormBreak label="Údaje o firmě" className="mt-4 mb-3" />

          <Input
            required
            label="IČO"
            type="text"
            error={formState.errors.businessInformations?.ico}
            disabled={fieldsAreDisabled}
            {...register('businessInformations.ico')}
          />

          <Input
            label="DIČ"
            type="text"
            error={formState.errors.businessInformations?.dic}
            disabled={fieldsAreDisabled}
            {...register('businessInformations.dic')}
          />
        </>
      ) : null}
    </div>
  );
};
