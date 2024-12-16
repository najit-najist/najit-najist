'use client';

import { Button } from '@components/common/Button';
import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Municipality } from '@najit-najist/database/models';
import debounce from 'lodash.debounce';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export const SearchForm: FC<{
  initialData?: {
    query?: string;
    address?: { municipality?: Pick<Municipality, 'id'> };
  };
}> = ({ initialData }) => {
  const formMethods = useForm({
    defaultValues: initialData,
  });
  const [isLoading, activateIsLoading] = useTransition();
  const pathName = usePathname();
  const router = useRouter();
  const { register, formState, handleSubmit, watch, reset } = formMethods;
  const isRemoveFilterEnabled = !!initialData?.address || !!initialData?.query;

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    ({ query, address }) => {
      let route = pathName;
      const searchParams = new URLSearchParams(window.location.search);

      searchParams.delete('page');

      if (query) {
        searchParams.set('query', query);
      } else {
        searchParams.delete('query');
      }

      if (address?.municipality) {
        searchParams.set(
          'address.municipality',
          String(address.municipality.id),
        );
      } else {
        searchParams.delete('address.municipality');
      }

      activateIsLoading(() => {
        // @ts-ignore
        router.replace(`${route}?${searchParams.toString()}`);
      });
    },
    [pathName, router],
  );

  const removeFilters = () => {
    if (!pathName) {
      return;
    }
    // Ideally we would not like to have full reload, but we need to loose state from search
    window.location.replace(window.location.pathname);
  };

  useEffect(() => {
    const debouncedSubmit = debounce(() => handleSubmit(onSubmit)(), 300);
    const subscription = watch(debouncedSubmit);

    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  return (
    <FormProvider {...formMethods}>
      <form className="flex gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Vyhledávání..."
          rootClassName="w-full"
          size="normal"
          suffix={
            <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
              {formState.isSubmitting || isLoading ? (
                <ArrowPathIcon className="w-5 h-5 mx-5 my-2 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="w-5 h-5  mx-5 my-2" />
              )}
            </div>
          }
          {...register('query')}
        />
        <MunicipalitySelect
          size="normal"
          name="address.municipality"
          className="flex-none min-w-[300px]"
        />
        <Button
          color="red"
          className="px-2 flex items-center justify-center"
          disabled={!isRemoveFilterEnabled}
          onClick={removeFilters}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-adjustments-off"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
            <path d="M6 6v2"></path>
            <path d="M6 12v8"></path>
            <path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
            <path d="M12 4v4m0 4v2"></path>
            <path d="M12 18v2"></path>
            <path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
            <path d="M18 4v1"></path>
            <path d="M18 9v5m0 4v2"></path>
            <path d="M3 3l18 18"></path>
          </svg>
        </Button>
      </form>
    </FormProvider>
  );
};
