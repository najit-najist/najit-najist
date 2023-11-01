'use client';

import { User } from '@najit-najist/api';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { getChangedValues } from '@utils';
import { trpc } from '@trpc';

export const Content: FC<{ user: User }> = ({ user }) => {
  const { mutateAsync: updateProfile } = trpc.users.update.useMutation();
  const formMethods = useForm<User>({
    defaultValues: user,
  });
  const { handleSubmit, formState, reset } = formMethods;

  const onSubmit: SubmitHandler<User> = useCallback(
    async (values) => {
      const nextValues = getChangedValues(values, formState.dirtyFields);

      // TODO provide correct typings
      if (nextValues.address && user.address?.id) {
        nextValues.address.id = user.address?.id;
      }

      await updateProfile({ id: user.id, payload: nextValues });
      reset(undefined, { keepValues: true });
    },
    [formState.dirtyFields, reset, updateProfile, user.address?.id, user.id]
  );

  return (
    <FormProvider {...formMethods}>
      <EditUserUnderPage
        viewType="edit"
        userId={user.id}
        onSubmit={handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
};
