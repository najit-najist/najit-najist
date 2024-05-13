'use client';

import { trpc } from '@client/trpc';
import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { UserWithRelations } from '@custom-types';
import { getChangedValues } from '@utils';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

export const Content: FC<{ user: UserWithRelations }> = ({ user }) => {
  const { mutateAsync: updateProfile } = trpc.users.update.useMutation();
  const formMethods = useForm<UserWithRelations>({
    defaultValues: user,
  });
  const { handleSubmit, formState, reset } = formMethods;

  const onSubmit: SubmitHandler<UserWithRelations> = useCallback(
    async (values) => {
      const nextValues = getChangedValues(values, formState.dirtyFields);

      // TODO provide correct typings
      if (nextValues.address && user.address?.id) {
        nextValues.address.id = user.address?.id;
      }

      await updateProfile({
        id: user.id,
        payload: {
          ...nextValues,
          telephone: nextValues.telephone ?? undefined,
          address: nextValues.address ?? undefined,
        },
      });
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
