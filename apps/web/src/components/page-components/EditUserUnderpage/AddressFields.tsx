import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { AppRouterInput } from '@custom-types/AppRouter';
import { Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * Set of fields that are specific to user address
 */
export const AddressFields: FC<{ required?: boolean; disabled?: boolean }> = ({
  required,
  disabled,
}) => {
  const { isActive } = useReactTransitionContext();
  const { formState, register } =
    useFormContext<AppRouterInput['profile']['update']>();
  const fieldsAreDisabled =
    disabled === undefined ? formState.isSubmitting || isActive : disabled;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          required={required}
          rootClassName="md:col-span-3"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          required={required}
          label="Město"
          placeholder="Název města"
          rootClassName="md:col-span-3"
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
        size={null}
        label="Kraj"
        name="address.municipality"
        required={required}
        disabled={fieldsAreDisabled}
      />
    </>
  );
};
