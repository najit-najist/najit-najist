'use client';

import { trpc } from '@client/trpc';
import { CouponWithRelations } from '@custom-types/CouponWithRelations';
import {
  ArrowPathIcon,
  CheckIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { products } from '@najit-najist/database/models';
import { Input, Paper, inputPrefixSuffixStyles } from '@najit-najist/ui';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@najit-najist/ui/headless';
import { getFileUrl } from '@server/utils/getFileUrl';
import Image from 'next/image';
import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import { useController, useFieldArray } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';

const fieldName = 'onlyForProducts';

export const SearchForm: FC = () => {
  const { field, formState } = useController<
    {
      onlyForProducts?: CouponWithRelations['onlyForProducts'][number]['product'][];
    },
    typeof fieldName
  >({
    name: fieldName,
  });
  const { remove } = useFieldArray({
    name: fieldName,
  });
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue('', 500);
  const { data, isLoading } = trpc.products.get.many.useQuery(
    { perPage: 4, search: debouncedSearch },
    { enabled: search.length ? !!debouncedSearch.length : false }
  );

  const value = field.value ?? [];

  const setSearchValue = useCallback(
    (value: string = '') => {
      setDebouncedSearch(value);
      setSearch(value);
    },
    [setSearch, setDebouncedSearch]
  );
  const handleOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const value = event.target.value;
      setSearchValue(value);
    },
    [setSearchValue]
  );
  const handleItemRemove = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      const index = Number(event.currentTarget.dataset.index);
      remove(index);
    },
    [remove]
  );

  return (
    <>
      <div className="mb-3 flex gap-2 flex-wrap duration">
        {value.map((item, index) => (
          <Paper key={item.id} className="px-3 py-2 flex items-start max-h-96">
            <div className="flex">
              <div className="relative aspect-square rounded-full flex-none w-12 h-12">
                {item.images.length ? (
                  <Image
                    width={56}
                    height={56}
                    unoptimized
                    src={getFileUrl(products, item.id, item.images[0].file)}
                    alt=""
                    className="absolute inset-0 h-full w-full bg-gray-100 object-cover rounded-full"
                  />
                ) : (
                  <div className="flex w-full h-full bg-gray-100 rounded-full">
                    <PhotoIcon className="w-6 h-6 m-auto" />
                  </div>
                )}
              </div>
              <div className="w-full mx-3">
                <p className="text-xs text-gray-600">
                  {item.category?.name ?? 'Bez kategorie'}
                </p>
                <p className="text-lg">{item.name}</p>
              </div>
            </div>
            <button
              className="flex-none"
              onClick={handleItemRemove}
              data-index={index}
            >
              <XMarkIcon className="w-4 h-4 hover:rotate-90 duration-300" />
            </button>
          </Paper>
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
                data?.items.map((product) => (
                  <ComboboxOption
                    key={product.id}
                    value={product}
                    className="data-[focus]:bg-project-primary/20 p-1 rounded hover:cursor-pointer flex justify-between items-start"
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex">
                          <div className="relative aspect-square rounded-full flex-none w-8 h-8">
                            {product.images.length ? (
                              <Image
                                width={56}
                                height={56}
                                unoptimized
                                src={getFileUrl(
                                  products,
                                  product.id,
                                  product.images[0].file
                                )}
                                alt=""
                                className="absolute inset-0 h-full w-full bg-gray-100 object-cover rounded-full"
                              />
                            ) : (
                              <div className="flex w-full h-full bg-gray-100 rounded-full">
                                <PhotoIcon className="w-6 h-6 m-auto" />
                              </div>
                            )}
                          </div>
                          <div className="w-full mx-3">
                            <p className="text-xs text-gray-500">
                              {product.category?.name ?? 'Bez kategorie'}
                            </p>
                            <p className="text-sm">{product.name}</p>
                          </div>
                        </div>
                        {selected ? (
                          <CheckIcon className="w-6 h-6 flex-none ml-2 mt-1" />
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
