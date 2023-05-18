'use client';

import { User } from '@najit-najist/api';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { trpc } from '@trpc';
import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';

export const Content: FC<{ user: User }> = ({ user }) => {
  const { mutateAsync: updateProfile } = trpc.profile.update.useMutation();
  const formMethods = useForm({
    defaultValues: user,
  });
  const { handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<User> = useCallback(
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
