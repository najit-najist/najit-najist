'use client';

import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Input } from '@najit-najist/ui';
import debounce from 'lodash.debounce';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';

export const SearchForm: FC<{ initialData?: { query?: string } }> = ({
  initialData,
}) => {
  const { register, formState, handleSubmit, watch } = useForm({
    defaultValues: initialData,
  });
  const [isLoading, activateIsLoading] = useTransition();
  const pathName = usePathname();
  const router = useRouter();

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    ({ query }) => {
      let route = pathName;

      if (query) {
        const searchParams = new URLSearchParams({
          query,
        });

        route += `?${searchParams.toString()}`;
      }

      activateIsLoading(() => {
        // @ts-ignore
        router.replace(route);
      });
    },
    [pathName, router]
  );

  useEffect(() => {
    const debouncedSubmit = debounce(() => handleSubmit(onSubmit)(), 300);
    const subscription = watch(debouncedSubmit);

    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="Vyhledávání..."
        rootClassName="w-full"
        size="normal"
        suffix={
          formState.isSubmitting || isLoading ? (
            <ArrowPathIcon className="w-6 h-6 mx-5 my-2 animate-spin" />
          ) : (
            <MagnifyingGlassIcon className="w-6 h-6 mx-5 my-2" />
          )
        }
        {...register('query')}
      />
    </form>
  );
};
