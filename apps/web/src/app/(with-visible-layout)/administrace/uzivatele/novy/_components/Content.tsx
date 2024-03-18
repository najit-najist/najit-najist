'use client';

import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { User } from '@najit-najist/database/models';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

export const Content: FC = () => {
  const formMethods = useForm<User>({});
  const { handleSubmit } = formMethods;
  const onSubmit: SubmitHandler<User> = useCallback(() => {}, []);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container grid grid-cols-1 md:grid-cols-6 mx-auto my-5"
      >
        <EditUserUnderPage viewType="create" />
      </form>
    </FormProvider>
  );
};
