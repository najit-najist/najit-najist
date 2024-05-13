'use client';

import { trpc } from '@client/trpc';
import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks';
import {
  Button,
  Input,
  FormBreak,
  inputPrefixSuffixStyles,
} from '@najit-najist/ui';
import { CheckboxWrapper } from '@najit-najist/ui';
import { Checkbox } from '@najit-najist/ui';
import { userRegisterInputSchema } from '@server/schemas/userRegisterInputSchema';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormValues } from '../_types/FormValues';
import { BottomLinks } from './Links';
import { PasswordInputs } from './PasswordInputs';
import { Title } from './Title';

const schema = userRegisterInputSchema
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
  const { trackEvent } = usePlausible();
  const { mutateAsync: doRegister } = trpc.profile.register.useMutation();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { register, handleSubmit, formState, setError } = formMethods;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await doRegister(values);
      trackEvent('New user registration');
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

              <MunicipalitySelect
                size={null}
                className="mt-3"
                label="Obec"
                name="address.municipality"
                disabled={fieldsAreDisabled}
                required
              />

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
                prefix={
                  <span
                    className={inputPrefixSuffixStyles({
                      type: 'prefix',
                      className: 'px-2 flex items-center justify-center',
                    })}
                  >
                    +420
                  </span>
                }
                inputMode="numeric"
                error={
                  formState.errors.telephone?.telephone ??
                  formState.errors.telephone
                }
                disabled={fieldsAreDisabled}
                {...register('telephone.telephone')}
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
                  className="shadow-sm w-full font-title"
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
