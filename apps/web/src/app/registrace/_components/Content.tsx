'use client';

import { Button } from '@components/common/Button';
import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { Checkbox } from '@components/common/form/Checkbox';
import { CheckboxWrapper } from '@components/common/form/CheckboxWrapper';
import { FormBreak } from '@components/common/form/FormBreak';
import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlausible } from '@hooks/usePlausible';
import { userRegisterInputSchema } from '@server/schemas/userRegisterInputSchema';
import { TRPCClientError } from '@trpc/client';
import { trpc } from '@trpc/web';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FieldError, FormProvider, useForm } from 'react-hook-form';
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
      <div className="flex min-h-full flex-col container justify-center w-full py-10">
        <Title />

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white p-5 shadow sm:rounded-project">
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
                      className: 'px-2',
                    })}
                  >
                    <span className="inline-flex items-center justify-center h-full">
                      +420
                    </span>
                  </span>
                }
                inputMode="numeric"
                error={
                  (formState.errors.telephone?.telephone ??
                    formState.errors.telephone) as FieldError | undefined
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
