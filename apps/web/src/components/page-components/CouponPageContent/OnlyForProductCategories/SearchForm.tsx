'use client';

import { trpc } from '@client/trpc';
import {
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { ProductCategory } from '@najit-najist/database/models';
import { Badge, Input, Paper, inputPrefixSuffixStyles } from '@najit-najist/ui';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@najit-najist/ui/headless';
import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import { useController, useFieldArray } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';

const fieldName = 'onlyForCategories';

export const SearchForm: FC = () => {
  const { field, formState } = useController<
    { onlyForCategories?: ProductCategory[] },
    typeof fieldName
  >({
    name: fieldName,
  });
  const { remove } = useFieldArray({
    name: fieldName,
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue('', 500);
  const { data, isPending: isLoading } =
    trpc.products.categories.get.many.useQuery(
      { perPage: 4, search: debouncedSearch },
      { enabled: search.length ? !!debouncedSearch.length : false },
    );

  const value = field.value ?? [];

  const setSearchValue = useCallback(
    (value: string = '') => {
      setDebouncedSearch(value);
      setSearch(value);
    },
    [setSearch, setDebouncedSearch],
  );
  const handleOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const value = event.target.value;
      setSearchValue(value);
    },
    [setSearchValue],
  );
  const handleItemRemove = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      const index = Number(event.currentTarget.dataset.index);
      remove(index);
    },
    [remove],
  );

  return (
    <>
      <div className="mb-3 flex gap-2 flex-wrap duration">
        {value.map((item, index) => (
          <Badge key={item.id} color="blue" size="lg">
            {item.name}
            <button onClick={handleItemRemove} data-index={index}>
              <XMarkIcon className="w-4 h-4 hover:rotate-90 duration-300" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Combobox
          immediate
          multiple
          by="id"
          value={value}
          onChange={field.onChange}
          onClose={setSearchValue}
          disabled={formState.isSubmitting}
        >
          <ComboboxInput
            as={Input}
            placeholder="Vyhledávání..."
            size="normal"
            suffix={
              <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
                {isLoading && search.length ? (
                  <ArrowPathIcon className="w-6 h-6 mx-5 my-2 animate-spin" />
                ) : (
                  <MagnifyingGlassIcon className="w-6 h-6 mx-5 my-2" />
                )}
              </div>
            }
            onChange={handleOnChange}
            disabled={formState.isSubmitting}
          />
          <ComboboxOptions
            as={Paper}
            anchor={{ to: 'bottom start', gap: 4 }}
            className="empty:hidden w-[--input-width] p-1"
          >
            {!!search ? (
              data?.items.length ? (
                data?.items.map((category) => (
                  <ComboboxOption
                    key={category.id}
                    value={category}
                    className="data-[focus]:bg-project-primary/20 p-1 rounded hover:cursor-pointer flex justify-between items-start"
                  >
                    {({ selected }) => (
                      <>
                        {category.name}
                        {selected ? (
                          <CheckIcon className="w-6 h-6 flex-none ml-2" />
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              ) : !isLoading ? (
                <p>Žádné položky pro zadání &quot;{debouncedSearch}&quot;</p>
              ) : null
            ) : null}
          </ComboboxOptions>
        </Combobox>
      </div>
    </>
  );
};
