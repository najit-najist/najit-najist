'use client';

import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { trpc } from '@trpc';
import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { getMeOutputSchema } from '@najit-najist/api';
import { z } from 'zod';

export const Content: FC<{ user: z.output<typeof getMeOutputSchema> }> = ({
  user,
}) => {
  const { mutateAsync: updateProfile } = trpc.profile.update.useMutation();
  const formMethods = useForm({
    defaultValues: user,
  });
  const { handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<z.output<typeof getMeOutputSchema>> =
    useCallback(
      async (values) => {
        await updateProfile({
          firstName: values.firstName,
          lastName: values.lastName,
        });
      },
      [updateProfile]
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
