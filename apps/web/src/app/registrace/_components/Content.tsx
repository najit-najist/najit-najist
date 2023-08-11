'use client';

import { Button, Input, FormBreak } from '@najit-najist/ui';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from 'trpc';
import { z } from 'zod';

import { BottomLinks } from './Links';
import { Title } from './Title';
import { CheckboxWrapper } from '@najit-najist/ui';
import { Checkbox } from '@najit-najist/ui';
import { TRPCClientError } from '@trpc/client';
import { PasswordInputs } from './PasswordInputs';
import { FormValues } from '../_types/FormValues';
import { registerUserSchema } from '@najit-najist/api';
import { MunicipalitySelect } from '@components/common/MunicipalitySelect';

const schema = registerUserSchema
  .extend({
    passwordAgain: z.string(),
  })
  .superRefine(({ passwordAgain, password }, ctx) => {
    if (password !== passwordAgain) {
      const errorMessageBase = {
        code: 'custom',
        fatal: true,
        message: 'Vaše hesla se musí shodovat',
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
  });

export const Content: FC = () => {
  const { mutateAsync: doRegister } = trpc.profile.register.useMutation();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = formMethods;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await doRegister(values);
    } catch (error) {
      if (error instanceof TRPCClientError && error.data.code === 'CONFLICT') {
        setError('email', {
          message: 'Uživatel s tímto emailem už existuje',
        });

        return;
      }

      throw error;
    }

    router.push('/login?registrationCallback');
  });

  const fieldsAreDisabled =
    formState.isSubmitting || formState.isSubmitSuccessful;

  return (
    <FormProvider {...formMethods}>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto w-full">
        <Title />

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={onSubmit}>
              <Input
                required
                label="Jméno"
                id="firstName"
                type="string"
                autoComplete="given-name"
                error={formState.errors.firstName}
                disabled={fieldsAreDisabled}
                {...register('firstName')}
              />
              <Input
                required
                label="Příjmení"
                id="lastName"
                type="string"
                autoComplete="family-name"
                error={formState.errors.lastName}
                disabled={fieldsAreDisabled}
                {...register('lastName')}
              />

              <FormBreak label="Adresa" />

              <MunicipalitySelect name="address.municipality" required />

              <FormBreak label="Přihlašovací údaje" />
              <Input
                required
                label="Emailová adresa"
                id="email"
                type="email"
                autoComplete="email"
                error={formState.errors.email}
                disabled={fieldsAreDisabled}
                {...register('email')}
              />
              <PasswordInputs />

              <FormBreak label="Obecné" />

              <Input
                label="Telefonní číslo"
                id="telephoneNumber"
                type="string"
                autoComplete="tel-national"
                prefix="+420"
                inputMode="numeric"
                error={formState.errors.telephoneNumber}
                disabled={fieldsAreDisabled}
                {...register('telephoneNumber')}
              />

              <FormBreak />

              <CheckboxWrapper
                childId="subscribe-newsletter"
                title="Odebírat newsletter"
              >
                <Checkbox
                  id="subscribe-newsletter"
                  disabled={fieldsAreDisabled}
                  {...register('newsletter')}
                />
              </CheckboxWrapper>

              <div className="!mt-8">
                <Button
                  isLoading={fieldsAreDisabled}
                  type="submit"
                  appearance="normal"
                  className="shadow-sm w-full"
                >
                  Registrovat
                </Button>
              </div>
            </form>
          </div>
          <BottomLinks />
        </div>
      </div>
    </FormProvider>
  );
};
