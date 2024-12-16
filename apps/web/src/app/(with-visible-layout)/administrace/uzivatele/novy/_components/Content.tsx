'use client';

import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@najit-najist/database/models';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { createUserAction } from '../createUserAction';
import { createUserValidationSchema } from '../validationSchema';

const resolver = zodResolver(
  createUserValidationSchema
    .extend({
      passwordAgain: z.string(),
    })
    .superRefine(({ passwordAgain, password }, ctx) => {
      if (password !== passwordAgain) {
        const errorMessageBase = {
          code: 'custom',
          fatal: true,
          message: 'Hesla se musí shodovat',
        } as const;

        ctx.addIssue({
          ...errorMessageBase,
          path: ['password'],
        });

        ctx.addIssue({
          ...errorMessageBase,
          path: ['passwordAgain'],
        });
      }
    }),
);

export const Content: FC = () => {
  const formMethods = useForm<z.infer<typeof createUserValidationSchema>>({
    resolver,
    defaultValues: {
      password: '',
    },
  });
  const { handleSubmit, setError } = formMethods;
  const onSubmit: SubmitHandler<z.infer<typeof createUserValidationSchema>> =
    useCallback(
      async (input) => {
        const result = await createUserAction(input);

        if (result) {
          for (const key in result.errors) {
            setError(key as any, result.errors[key]);
          }

          throw new Error('Formulář má chyby');
        }
      },
      [setError],
    );

  return (
    <FormProvider {...formMethods}>
      <div className="container grid grid-cols-1 md:grid-cols-6 mx-auto my-5">
        <form onSubmit={handleSubmit(onSubmit)} className="col-span-full">
          <EditUserUnderPage viewType="create" />
        </form>
      </div>
    </FormProvider>
  );
};
