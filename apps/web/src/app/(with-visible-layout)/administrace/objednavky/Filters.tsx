'use client';

import {
  RadioGroup,
  RadioGroupVariants,
} from '@components/common/form/RadioGroup';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';

import { OrderPageListView } from './_types';
import { changeListViewAction } from './changeListViewAction';

type FormValues = {
  listView?: OrderPageListView;
};

const sortFieldItems = [
  {
    id: OrderPageListView.ALL,
    name: 'Všechny',
  },
  {
    id: OrderPageListView.NEW,
    name: 'Nové',
  },
  {
    id: OrderPageListView.UNFINISHED,
    name: 'Potvrzené ale nedokončené',
  },
  {
    id: OrderPageListView.FINISHED,
    name: 'Dokončené',
  },
  {
    id: OrderPageListView.CANCELED,
    name: 'Zrušené',
  },
];

export const Filters: FC<{
  initialValues?: FormValues;
}> = ({ initialValues }) => {
  const router = useRouter();
  const formMethods = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const { handleSubmit, watch, control } = formMethods;
  const { field: sortField } = useController({
    name: 'listView',
    control,
  });

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    async ({ listView = OrderPageListView.ALL }) => {
      await changeListViewAction({
        listView,
      });
    },
    [router],
  );

  useEffect(() => {
    const debouncedSubmit = debounce(() => handleSubmit(onSubmit)(), 300);
    const subscription = watch(debouncedSubmit);

    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  return (
    <div className="flex-none w-full mx-auto my-5 container">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-3">
            <RadioGroup<(typeof sortFieldItems)[number]>
              accessKey="id"
              valueAs="key"
              keyName="id"
              value={sortField.value as any}
              name={sortField.name}
              disabled={sortField.disabled}
              onBlur={sortField.onBlur}
              onChange={sortField.onChange}
              variant={RadioGroupVariants.Radios}
              itemsWrapperClassName="flex flex-wrap gap-x-6 !space-y-0"
              items={sortFieldItems}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
