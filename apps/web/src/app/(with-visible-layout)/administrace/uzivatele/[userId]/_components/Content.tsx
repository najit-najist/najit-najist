'use client';

import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { User } from '@najit-najist/api';
import { trpc } from '@trpc';
import { getChangedValues } from '@utils';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container grid grid-cols-1 md:grid-cols-6 mx-auto my-5"
      >
        <EditUserUnderPage viewType="edit" userId={user.id} />
      </form>
    </FormProvider>
  );
};
