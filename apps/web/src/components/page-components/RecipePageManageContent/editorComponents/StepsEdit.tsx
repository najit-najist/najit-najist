'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Recipe } from '@najit-najist/api';
import { Button, Input, Skeleton } from '@najit-najist/ui';
import dynamic from 'next/dynamic';
import { FC, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RecipeFormData } from '../_types';

const LazyEditor = dynamic(
  () =>
    import('@najit-najist/ui/editor').then(({ QuillEditor }) => QuillEditor),
  {
    ssr: false,
    loading() {
      return <Skeleton rounded className="h-14" />;
    },
  }
);

export const StepsEdit: FC = () => {
  const { watch, register, setValue, getValues, formState } =
    useFormContext<RecipeFormData>();
  const stepGroups = watch('steps');

  const onAddGroup = useCallback(() => {
    setValue('steps', [...getValues().steps, { parts: [], title: '' }]);
  }, [setValue, getValues]);

  const onAddStep = useCallback(
    (groupIndex: number) => () => {
      setValue(`steps.${groupIndex}.parts`, [
        ...getValues().steps[groupIndex].parts,
        { content: '', duration: 0 },
      ]);
    },
    [setValue, getValues]
  );

  const onRemoveGroup = useCallback(
    (index: number) => () => {
      const newResources = [...getValues().resources];
      delete newResources[index];

      setValue('resources', newResources);
    },
    [setValue, getValues]
  );

  const onRemoveStep = useCallback(
    (index: number) => () => {
      const newResources = [...getValues().resources];
      delete newResources[index];

      setValue('resources', newResources);
    },
    [setValue, getValues]
  );

  return (
    <>
      <ul className="grid gap-2">
        {(stepGroups ?? []).map((item, groupIndex) => (
          <li key={groupIndex}>
            <div className="flex gap-2 items-end">
              <Input
                rootClassName="w-full"
                label="Název skupiny"
                disabled={formState.isSubmitting}
                {...register(`steps.${groupIndex}.title`)}
              />

              <Button
                onClick={onRemoveGroup(groupIndex)}
                color="softRed"
                appearance="spaceless"
                disabled={formState.isSubmitting}
                className="px-2 pt-1.5 pb-1 flex-none"
              >
                <TrashIcon className="w-5 h-5" />
              </Button>
            </div>

            <ul>
              {item.parts.map((groupPart, groupItemIndex) => (
                <li key={groupItemIndex} className="flex gap-2 mt-3">
                  <div className="bg-white aspect-square flex items-center justify-center h-[38px] border-gray-300 border rounded-md mt-6 flex-none">
                    {groupItemIndex + 1}.
                  </div>
                  <div className="w-full">
                    <Input
                      label="Délka kroku"
                      rootClassName="mb-3"
                      disabled={formState.isSubmitting}
                      {...register(
                        `steps.${groupIndex}.parts.${groupItemIndex}.duration`,
                        {
                          valueAsNumber: true,
                        }
                      )}
                    />
                    <Controller
                      name={`steps.${groupIndex}.parts.${groupItemIndex}.content`}
                      render={({ field: { ref, ...field } }) => (
                        <LazyEditor {...field} />
                      )}
                    />
                  </div>
                </li>
              ))}
              <li className="mt-5 pl-[45px]">
                <Button
                  onClick={onAddStep(groupIndex)}
                  className="w-full !p-2"
                  color="white"
                  disabled={formState.isSubmitting}
                >
                  <PlusIcon className="w-5 h-5 inline -mt-1 mr-3" />
                  Přidat další krok
                </Button>
              </li>
            </ul>
          </li>
        ))}
        <li className="mt-5">
          <Button
            onClick={onAddGroup}
            className="w-full !p-2"
            color="white"
            disabled={formState.isSubmitting}
          >
            <PlusIcon className="w-5 h-5 inline -mt-1 mr-3" />
            Přidat další skupinu
          </Button>
        </li>
      </ul>
    </>
  );
};
