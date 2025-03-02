import { Municipality } from '@najit-najist/database/models';
import { trpc } from '@trpc/web';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';

import { Combobox, ComboboxProps } from './form/Combobox';

export const MunicipalitySelect: FC<
  Pick<ComboboxProps, 'className' | 'required' | 'label' | 'size'> & {
    name: string;
    disabled?: boolean;
  }
> = ({ name, ...rest }) => {
  const { field, fieldState } = useController({
    name,
  });

  const [debouncedQuery, setDebouncedQuery] = useDebounceValue('', 300);
  const { data, isPending: isLoading } =
    trpc.address.municipality.get.many.useQuery({
      query: debouncedQuery,
    });

  return (
    <Combobox<Municipality>
      placeholder="Začněte psát pro vyhledání"
      displayValue={(item) => item?.name}
      itemLabelFormatter={(item) => item?.name}
      items={data ?? []}
      onInputValueChange={(event) =>
        setDebouncedQuery(event.currentTarget.value)
      }
      onSelectedValueChange={(nextValue) => {
        field.onBlur();
        field.onChange(nextValue);
      }}
      selectedValue={field.value}
      isLoading={isLoading}
      error={fieldState.error}
      disabled={rest.disabled ?? false}
      {...rest}
      ref={field.ref}
    />
  );
};
