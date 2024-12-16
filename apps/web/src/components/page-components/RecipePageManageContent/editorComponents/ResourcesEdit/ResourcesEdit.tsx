'use client';

import { Button } from '@components/common/Button';
import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { Input } from '@components/common/form/Input';
import { Select } from '@components/common/form/Select';
import { ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { RecipeResourceMetric } from '@najit-najist/database/models';
import { trpc } from '@trpc/web';
import { FC, useCallback, useMemo, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { RecipeFormData } from '../../_types';
import { AddMetricModal } from './AddMetricModal';

const MetricSelect: FC<{
  initialMetrics: RecipeResourceMetric[];
  index: number;
}> = ({ initialMetrics, index }) => {
  const { field, fieldState, formState } = useController<
    RecipeFormData,
    `resources.${number}.metric`
  >({
    name: `resources.${index}.metric`,
  });
  const [addNewItemModalOpen, setAddNewItemModalOpen] = useState(false);
  const { data: metrics } = trpc.recipes.metrics.getMany.useQuery(
    {},
    {
      initialData: {
        nextToken: null,
        total: initialMetrics.length,
        items: initialMetrics,
      },
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );
  const metricsSet = useMemo(
    () => new Map(metrics.items.map((item) => [item.id, item])),
    [metrics],
  );

  const addNewResourceMetric = useCallback(() => {
    setAddNewItemModalOpen(true);
  }, []);

  return (
    <>
      <Select
        name={field.name}
        selected={metricsSet.get(field.value?.id)}
        items={metrics.items}
        formatter={({ name }) => name}
        onChange={(item) => field.onChange(item)}
        disabled={formState.isSubmitting}
        error={(fieldState.error as any)?.id ?? fieldState.error}
        className="min-w-[140px]"
        label="Hello"
        onAddNewItem={addNewResourceMetric}
      />
      <AddMetricModal
        onClose={() => {
          setAddNewItemModalOpen(false);
        }}
        open={addNewItemModalOpen}
        onCreated={(created) => field.onChange(created)}
      />
    </>
  );
};

export const ResourcesEdit: FC<{ metrics: RecipeResourceMetric[] }> = ({
  metrics: initialMetrics,
}) => {
  const { register, formState } = useFormContext<RecipeFormData>();
  const {
    fields: resources,
    append,
    remove,
  } = useFieldArray<RecipeFormData>({ name: 'resources' });

  const onAdd = useCallback(() => {
    append(
      {
        count: 0,
        title: '',
        optional: false,
        metric: {
          id: 0,
        },
        description: '',
      },
      { shouldFocus: true },
    );
  }, [append]);

  const onRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove],
  );

  return (
    <>
      {formState.errors.resources?.message ? (
        <ErrorMessage>
          <ExclamationCircleIcon className="w-5 h-5 inline -mt-1" />{' '}
          {formState.errors.resources?.message}
        </ErrorMessage>
      ) : null}
      <ul className="grid gap-2">
        {(resources ?? []).map((item, index) => (
          <li
            key={item.id}
            className=" gap-2 flex items-start rounded-project hover:bg-gray-50"
          >
            <div className="bg-white aspect-square flex items-center justify-center h-10 border-gray-300 border rounded-project mt-6">
              {index + 1}.
            </div>
            <Input
              rootClassName="w-full"
              label="Název"
              disabled={formState.isSubmitting}
              {...register(`resources.${index}.title`)}
            />
            <Input
              label="Počet"
              disabled={formState.isSubmitting}
              {...register(`resources.${index}.count`, { valueAsNumber: true })}
            />

            <MetricSelect index={index} initialMetrics={initialMetrics} />

            <Button
              onClick={onRemove(index)}
              color="red"
              appearance="ghost"
              className="w-10 h-10 flex-none !px-1 mt-6"
              disabled={formState.isSubmitting}
            >
              <TrashIcon className="w-6 h-6 m-auto" />
            </Button>
          </li>
        ))}
        <li className="mt-3">
          <Button
            onClick={onAdd}
            className="w-full !p-2"
            disabled={formState.isSubmitting}
            appearance="link"
          >
            <PlusIcon className="w-5 h-5 inline -mt-1 mr-3" />
            Přidat další
          </Button>
        </li>
      </ul>
    </>
  );
};
