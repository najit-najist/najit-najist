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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfile, updateProfileSchema, User } from '@najit-najist/api';

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

export const Content: FC<{
  initialData: UpdateProfile;
  userId: User['id'];
}> = ({ initialData, userId }) => {
  const { mutateAsync: updateProfile } = trpc.profile.update.useMutation();
  const formMethods = useForm<UpdateProfile>({
    defaultValues: initialData,
    resolver: zodResolver(updateProfileSchema),
  });
  const { handleSubmit, formState, reset } = formMethods;

  const onSubmit: SubmitHandler<z.input<typeof updateProfileSchema>> =
    useCallback(
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
    <FormProvider {...formMethods}>
      <EditUserUnderPage
        onSubmit={handleSubmit(onSubmit)}
        viewType="edit-myself"
        userId={userId}
      />
    </FormProvider>
  );
};
