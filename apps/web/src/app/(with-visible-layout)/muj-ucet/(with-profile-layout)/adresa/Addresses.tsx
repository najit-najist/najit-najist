'use client';

import { AddressFields } from '@components/page-components/EditUserUnderpage/AddressFields';
import { FC } from 'react';
import { useFormStatus } from 'react-dom';
import { useFormContext } from 'react-hook-form';

import type { FormData } from './FormProvider';

export const Addresses: FC = () => {
  const { control } = useFormContext<FormData>();
  const { pending } = useFormStatus();

  return (
    <AddressFields
      control={control}
      disabled={pending}
      fieldMap={{
        city: 'city',
        country: 'city',
        houseNumber: 'houseNumber',
        municipality: 'municipality',
        postalCode: 'postalCode',
        streetName: 'streetName',
      }}
    />
  );
};
