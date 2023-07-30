'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Button, Input, Skeleton } from '@najit-najist/ui';
import dynamic from 'next/dynamic';
import { FC, useCallback } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
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

const GroupSteps: FC<{ groupIndex: number }> = ({ groupIndex }) => {
  const { formState, register } = useFormContext();
  const {
    fields: parts,
    append,
    remove,
  } = useFieldArray<RecipeFormData>({
    name: `steps.${groupIndex}.parts`,
    shouldUnregister: true,
  });

  const onAddStep = useCallback(() => {
    append({ content: '', duration: 0 });
  }, [append]);

  const onRemoveStep = useCallback(
    (itemIndex: number) => () => {
      remove(itemIndex);
    },
    [remove]
  );

  return (
    <ul>
      {parts.map((groupPart, groupItemIndex) => (
        <li key={groupPart.id} className="flex gap-2 mt-3">
          <div className="w-[40px] mt-6 flex-none flex flex-col gap-3">
            <div className="bg-white aspect-square flex items-center justify-center w-full rounded-md border border-gray-300">
              {groupItemIndex + 1}.
            </div>
            <Button
              onClick={onRemoveStep(groupItemIndex)}
              color="softRed"
              appearance="spaceless"
              disabled={formState.isSubmitting}
              className="px-2 pt-2 pb-1 flex-none"
            >
              <TrashIcon className="w-5 h-5" />
            </Button>
          </div>
          <div className="w-full">
            <Input
              label="Délka kroku"
              rootClassName="mb-3"
              disabled={formState.isSubmitting}
              type="number"
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
          onClick={onAddStep}
          className="w-full !p-2"
          color="white"
          disabled={formState.isSubmitting}
        >
          <PlusIcon className="w-5 h-5 inline -mt-1 mr-3" />
          Přidat další krok
        </Button>
      </li>
    </ul>
  );
};

export const StepsEdit: FC = () => {
  const { register, formState } = useFormContext<RecipeFormData>();
  const {
    fields: groups,
    append,
    remove,
  } = useFieldArray<RecipeFormData>({
    name: 'steps',
    shouldUnregister: true,
  });

  const onAddGroup = useCallback(() => {
    append({ parts: [], title: '' });
  }, [append]);

  const onRemoveGroup = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove]
  );

  return (
    <>
      <ul className="grid gap-2">
        {(groups ?? []).map((item, groupIndex) => (
          <li key={item.id}>
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
                className="w-10 h-10 flex-none"
              >
                <TrashIcon className="w-5 h-5 m-auto" />
              </Button>
            </div>

            <GroupSteps groupIndex={groupIndex} />
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
