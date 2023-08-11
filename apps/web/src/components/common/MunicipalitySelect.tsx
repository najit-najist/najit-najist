import { Municipality } from '@najit-najist/api';
import { Combobox } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { FC, useState } from 'react';
import { useController } from 'react-hook-form';
import { useDebounce } from 'react-use';

export const MunicipalitySelect: FC<{ name: string; required?: boolean }> = ({
  name,
  required,
}) => {
  const { field, fieldState } = useController({
    name,
  });

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data, isLoading } = trpc.address.municipality.get.many.useQuery(
    {
      query: debouncedQuery,
    },
    { suspense: false }
  );

  useDebounce(() => setDebouncedQuery(query), 300, [query]);

  return (
    <Combobox<Municipality>
      className="mt-3"
      required={required}
      placeholder="Začněte psát pro vyhledání"
      displayValue={({ name }) => name}
      itemLabelFormatter={({ name }) => name}
      items={data?.items ?? []}
      onInputValueChange={(event) => setQuery(event.currentTarget.value)}
      onSelectedValueChange={(nextValue) => {
        field.onBlur();
        field.onChange(nextValue);
      }}
      selectedValue={field.value}
      isLoading={isLoading}
      label="Obec"
      error={fieldState.error}
    />
  );
};
