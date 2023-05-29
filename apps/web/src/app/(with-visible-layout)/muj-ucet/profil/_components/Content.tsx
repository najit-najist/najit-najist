'use client';

import { FC, useCallback } from 'react';
import {
  FormProvider,
  FormState,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { trpc } from '@trpc';
import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { getMeOutputSchema, updateUserInputSchema } from '@najit-najist/api';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export function getChangedValues<G extends Record<any, any>>(
  allValues: G,
  dirtyFields: FormState<G>['dirtyFields'] | true
): Partial<G> {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;

  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      getChangedValues(allValues[key], dirtyFields[key] as any),
    ])
  ) as Partial<G>;
}

export const Content: FC<{ user: z.output<typeof getMeOutputSchema> }> = ({
  user,
}) => {
  const { mutateAsync: updateProfile } = trpc.profile.update.useMutation();
  const formMethods = useForm({
    defaultValues: user,
    resolver: zodResolver(updateUserInputSchema),
  });
  const { handleSubmit, formState, reset } = formMethods;

  const onSubmit: SubmitHandler<z.output<typeof getMeOutputSchema>> =
    useCallback(
      async (values) => {
        await updateProfile(getChangedValues(values, formState.dirtyFields));
        reset(undefined, { keepValues: true });
      },
      [updateProfile, formState.dirtyFields, reset]
    );

  return (
    <FormProvider {...formMethods}>
      <EditUserUnderPage
        onSubmit={handleSubmit(onSubmit)}
        viewType="edit-myself"
        userId={user.id}
      />
    </FormProvider>
  );
};
