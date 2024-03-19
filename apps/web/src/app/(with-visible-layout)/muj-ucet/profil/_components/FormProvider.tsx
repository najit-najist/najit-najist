'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileUpdateInputSchema } from '@najit-najist/api';
import { trpc } from '@trpc';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormState,
  FormProvider as HookFormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

export function getChangedValues<G extends Record<any, any>>(
  allValues: G,
  dirtyFields: FormState<G>['dirtyFields'] | true
): Partial<G> {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;

  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      getChangedValues(allValues[key], (dirtyFields as any)[key]),
    ])
  ) as Partial<G>;
}

type FormData = z.infer<typeof userProfileUpdateInputSchema>;

export const FormProvider: FC<PropsWithChildren<{ initialData: FormData }>> = ({
  children,
  initialData,
}) => {
  const { mutateAsync: updateProfile } = trpc.profile.update.useMutation();
  const formMethods = useForm<FormData>({
    defaultValues: initialData,
    resolver: zodResolver(userProfileUpdateInputSchema),
  });
  const { handleSubmit, formState, reset } = formMethods;

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (values) => {
      const nextValues = getChangedValues(values, formState.dirtyFields);

      // TODO provide correct typings
      // @ts-ignore
      if (nextValues.address && initialData.address?.id) {
        // @ts-ignore
        nextValues.address.id = initialData.address?.id;
      }

      await updateProfile(nextValues);
      reset(undefined, { keepValues: true });
    },
    [updateProfile, initialData, formState.dirtyFields, reset]
  );

  return (
    <HookFormProvider {...formMethods}>
      <form
        className="container grid grid-cols-1 md:grid-cols-6 mx-auto my-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </HookFormProvider>
  );
};
