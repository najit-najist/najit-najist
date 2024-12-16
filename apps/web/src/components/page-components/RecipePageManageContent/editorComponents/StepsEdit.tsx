'use client';

import { Button } from '@components/common/Button';
import { Skeleton } from '@components/common/Skeleton';
import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { Input } from '@components/common/form/Input';
import { ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';
import { FC, useCallback } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { RecipeFormData } from '../_types';

const LazyEditor = dynamic(
  () => import('../../../common/editor').then(({ QuillEditor }) => QuillEditor),
  {
    ssr: false,
    loading() {
      return <Skeleton rounded className="h-14" />;
    },
  },
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
    [remove],
  );

  return (
    <ul>
      {parts.map((groupPart, groupItemIndex) => (
        <li key={groupPart.id} className="flex gap-2 mt-3">
          <div className="w-[40px] mt-6 flex-none flex flex-col gap-3">
            <div className="bg-white aspect-square flex items-center justify-center w-full rounded-project border border-gray-300">
              {groupItemIndex + 1}.
            </div>
          </div>
          <div className="w-full">
            <div className="flex gap-3">
              <Input
                label="Délka kroku"
                rootClassName="mb-3 w-full"
                disabled={formState.isSubmitting}
                type="number"
                placeholder="v minutách"
                min={1}
                error={
                  (formState.errors.steps as any)?.[groupIndex]?.parts?.[
                    groupItemIndex
                  ]?.duration
                }
                {...register(
                  `steps.${groupIndex}.parts.${groupItemIndex}.duration`,
                  {
                    valueAsNumber: true,
                  },
                )}
              />
              <Button
                onClick={onRemoveStep(groupItemIndex)}
                disabled={formState.isSubmitting}
                color="red"
                appearance="ghost"
                className="w-10 h-10 flex-none !px-1 mt-6"
              >
                <TrashIcon className="w-6 h-6" />
              </Button>
            </div>
            <Controller
              name={`steps.${groupIndex}.parts.${groupItemIndex}.content`}
              render={({ field: { ref, ...field }, fieldState }) => (
                <LazyEditor error={fieldState.error} {...field} />
              )}
            />
          </div>
        </li>
      ))}
      <li className="mt-5 pl-[45px]">
        <Button
          onClick={onAddStep}
          className="w-full !p-2"
          disabled={formState.isSubmitting}
          appearance="link"
        >
          <PlusIcon className="w-6 h-6 inline -mt-1 mr-3" />
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
  });

  const onAddGroup = useCallback(() => {
    append({ parts: [], title: '' }, { shouldFocus: true });
  }, [append]);

  const onRemoveGroup = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove],
  );

  return (
    <>
      {formState.errors.steps?.message ? (
        <ErrorMessage>
          <ExclamationCircleIcon className="w-6 h-6 inline -mt-1" />{' '}
          {formState.errors.steps?.message}
        </ErrorMessage>
      ) : null}
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
                disabled={formState.isSubmitting}
                color="red"
                appearance="ghost"
                className="w-10 h-10 flex-none !px-1 mt-6"
              >
                <TrashIcon className="w-6 h-6 m-auto" />
              </Button>
            </div>

            <GroupSteps groupIndex={groupIndex} />
          </li>
        ))}
        <li className="mt-5">
          <Button
            onClick={onAddGroup}
            className="w-full !p-2"
            disabled={formState.isSubmitting}
            appearance="link"
          >
            <PlusIcon className="w-6 h-6 inline -mt-1 mr-3" />
            Přidat další skupinu
          </Button>
        </li>
      </ul>
    </>
  );
};
