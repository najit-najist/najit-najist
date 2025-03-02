'use client';

import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { Input } from '@components/common/form/Input';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import {
  Control,
  FieldError,
  FieldPath,
  FieldValues,
  useFormContext,
  get as getWithDotNotation,
} from 'react-hook-form';

/**
 * Set of fields that are specific to user address
 */
export function AddressFields<TFieldValues extends FieldValues = FieldValues>({
  required,
  disabled,
  fieldMap,
}: {
  required?: boolean;
  disabled?: boolean;
  control: Control<TFieldValues>;
  fieldMap: {
    streetName: FieldPath<TFieldValues>;
    houseNumber: FieldPath<TFieldValues>;
    postalCode: FieldPath<TFieldValues>;
    city: FieldPath<TFieldValues>;
    municipality: FieldPath<TFieldValues>;
    country: FieldPath<TFieldValues>;
  };
}) {
  const { isActive } = useReactTransitionContext();
  const { formState, register } = useFormContext();
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
          error={
            getWithDotNotation(formState.errors, fieldMap.streetName) as
              | FieldError
              | undefined
          }
          disabled={fieldsAreDisabled}
          {...register(fieldMap.streetName)}
        />
        <Input
          required={required}
          rootClassName="flex-none w-full"
          label="Číslo popisné"
          placeholder="Čp."
          // autoComplete="email"
          error={
            getWithDotNotation(formState.errors, fieldMap.houseNumber) as
              | FieldError
              | undefined
          }
          disabled={fieldsAreDisabled}
          {...register(fieldMap.houseNumber)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          required={required}
          label="Město"
          placeholder="Název města"
          rootClassName="md:col-span-3"
          autoComplete="address-level2"
          error={
            getWithDotNotation(formState.errors, fieldMap.city) as
              | FieldError
              | undefined
          }
          disabled={fieldsAreDisabled}
          {...register(fieldMap.city)}
        />
        <Input
          required={required}
          rootClassName="flex-none w-full"
          label="PSČ"
          placeholder="123 45"
          autoComplete="postal-code"
          error={
            getWithDotNotation(formState.errors, fieldMap.postalCode) as
              | FieldError
              | undefined
          }
          disabled={fieldsAreDisabled}
          {...register(fieldMap.postalCode)}
        />
      </div>

      <MunicipalitySelect
        size={null}
        label="Kraj"
        name={fieldMap.municipality}
        required={required}
        disabled={fieldsAreDisabled}
      />
    </>
  );
}
