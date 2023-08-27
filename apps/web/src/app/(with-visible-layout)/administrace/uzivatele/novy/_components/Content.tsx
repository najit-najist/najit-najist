'use client';

import { User } from '@najit-najist/api';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';

export const Content: FC = () => {
  const formMethods = useForm<User>({});
  const { handleSubmit } = formMethods;
  const onSubmit: SubmitHandler<User> = useCallback(() => {}, []);

  return (
    <FormProvider {...formMethods}>
      <EditUserUnderPage viewType="create" onSubmit={handleSubmit(onSubmit)} />
    </FormProvider>
  );
};
