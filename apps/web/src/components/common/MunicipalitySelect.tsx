import { trpc } from '@client/trpc';
import { Municipality } from '@najit-najist/database/models';
import { Combobox, ComboboxProps } from '@najit-najist/ui';
import { FC, useState } from 'react';
import { useController } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';

export const MunicipalitySelect: FC<
  Pick<ComboboxProps, 'className' | 'required' | 'label' | 'size'> & {
    name: string;
    disabled?: boolean;
  }
> = ({ name, ...rest }) => {
  const { field, fieldState } = useController({
    name,
  });

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = trpc.address.municipality.get.many.useQuery(
    {
      query: debouncedQuery,
    },
    { suspense: false }
  );

  return (
    <Combobox<Municipality>
      placeholder="Začněte psát pro vyhledání"
      displayValue={(item) => item?.name}
      itemLabelFormatter={(item) => item?.name}
      items={data ?? []}
      onInputValueChange={(event) => setQuery(event.currentTarget.value)}
      onSelectedValueChange={(nextValue) => {
        field.onBlur();
        field.onChange(nextValue);
      }}
      selectedValue={field.value}
      isLoading={isLoading}
      error={fieldState.error}
      disabled={rest.disabled ?? false}
      {...rest}
    />
  );
};
