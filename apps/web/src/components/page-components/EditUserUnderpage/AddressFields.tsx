import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { AppRouterInput } from '@najit-najist/api';
import { Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * Set of fields that are specific to user address
 */
export const AddressFields: FC<{ required?: boolean }> = ({ required }) => {
  const { formState, register } =
    useFormContext<AppRouterInput['profile']['update']>();
  const fieldsAreDisabled = formState.isSubmitting;

  return (
    <>
      <div className="sm:flex gap-4">
        <Input
          required={required}
          rootClassName="w-full"
          label="Ulice"
          autoComplete="street-address"
          placeholder="Název ulice"
          error={formState.errors.address?.streetName}
          disabled={fieldsAreDisabled}
          {...register('address.streetName')}
        />
        <Input
          required={required}
          rootClassName="flex-none w-26"
          label="Číslo popisné"
          placeholder="Čp."
          // autoComplete="email"
          error={formState.errors.address?.houseNumber}
          disabled={fieldsAreDisabled}
          {...register('address.houseNumber')}
        />
      </div>

      <div className="sm:flex gap-4">
        <Input
          required={required}
          label="Město"
          placeholder="Název města"
          rootClassName="w-full"
          autoComplete="address-level2"
          error={formState.errors.address?.city}
          disabled={fieldsAreDisabled}
          {...register('address.city')}
        />
        <Input
          required={required}
          rootClassName="flex-none w-26"
          label="PSČ"
          placeholder="123 45"
          autoComplete="postal-code"
          error={formState.errors.address?.postalCode}
          disabled={fieldsAreDisabled}
          {...register('address.postalCode')}
        />
      </div>

      <MunicipalitySelect
        label="Kraj"
        name="address.municipality"
        required={required}
      />
    </>
  );
};