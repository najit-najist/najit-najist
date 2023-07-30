'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { RecipeResourceMetric } from '@najit-najist/api';
import { Button, Input, Select } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { FC, useCallback, useMemo, useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { RecipeFormData } from '../../_types';
import { AddMetricModal } from './AddMetricModal';

const MetricSelect: FC<{
  initialMetrics: RecipeResourceMetric[];
  index: number;
}> = ({ initialMetrics, index }) => {
  const [addNewItemModalOpen, setAddNewItemModalOpen] = useState(false);
  const { data: metrics, refetch } = trpc.recipes.metrics.getMany.useQuery(
    undefined,
    {
      initialData: { items: initialMetrics },
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const metricsSet = useMemo(
    () => new Map(metrics.items.map((item) => [item.id, item])),
    [metrics]
  );

  const addNewResourceMetric = useCallback(() => {
    setAddNewItemModalOpen(true);
  }, []);

  return (
    <>
      <Controller
        name={`resources.${index}.metric`}
        render={({
          field: { name, onChange, value },
          formState,
          fieldState,
        }) => (
          <Select
            name={name}
            selected={metricsSet.get(value)}
            items={metrics.items}
            formatter={({ name }) => name}
            onChange={({ id }) => onChange(id)}
            disabled={formState.isSubmitting}
            error={fieldState.error}
            className="min-w-[140px]"
            onAddNewItem={addNewResourceMetric}
          />
        )}
      />
      <AddMetricModal
        onClose={() => {
          setAddNewItemModalOpen(false);
          refetch();
        }}
        open={addNewItemModalOpen}
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
    append({
      count: 0,
      title: '',
      isOptional: false,
      metric: '',
      description: '',
    });
  }, [append]);

  const onRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove]
  );

  return (
    <>
      <ul className="grid gap-2">
        {(resources ?? []).map((item, index) => (
          <li
            key={item.id}
            className=" gap-2 flex items-end rounded-md hover:bg-gray-50"
          >
            <div className="bg-white aspect-square flex items-center justify-center h-[38px] border-gray-300 border rounded-md">
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
              color="softRed"
              appearance="spaceless"
              className="w-10 h-10 flex-none"
              disabled={formState.isSubmitting}
            >
              <TrashIcon className="w-5 h-5 m-auto" />
            </Button>
          </li>
        ))}
        <li className="mt-5">
          <Button
            onClick={onAdd}
            className="w-full !p-2"
            color="white"
            disabled={formState.isSubmitting}
          >
            <PlusIcon className="w-5 h-5 inline -mt-1 mr-3" />
            Přidat další
          </Button>
        </li>
      </ul>
    </>
  );
};
