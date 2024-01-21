'use client';

import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { loginPageCallbacks } from '@constants';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  VerifyRegistrationFromPreviewInput,
  verifyRegistrationFromPreviewInputSchema,
} from '@najit-najist/api';
import { Button, ErrorMessage, FormBreak } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PasswordInputs } from '../../../_components/PasswordInputs';

export const Form: FC<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const { mutateAsync: finishRegistration } =
    trpc.profile.verifyRegistrationFromPreview.useMutation();
  const formMethods = useForm<VerifyRegistrationFromPreviewInput>({
    defaultValues: {
      token,
      password: '',
    },
    resolver: zodResolver(verifyRegistrationFromPreviewInputSchema),
  });
  const { handleSubmit, formState, setError } = formMethods;
  const fieldsAreDisabled =
    formState.isSubmitting || formState.isSubmitSuccessful;

  const onSubmit: Parameters<typeof handleSubmit>['0'] = async (values) => {
    try {
      await finishRegistration(values);
      router.push(
        `/login?${loginPageCallbacks.previewRegistrationFinished}=true`
      );
    } catch (error) {
      setError('root', {
        message: (error as Error).message,
      });

      throw error;
    }
  };

  return (
    <FormProvider {...formMethods}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white shadow sm:rounded-lg py-8 px-4 sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <PasswordInputs />
          <FormBreak label="Adresa" />
          <MunicipalitySelect
            className="mt-3"
            label="Obec"
            name="address.municipality"
            required
            size={null}
          />

          {formState.errors.root ? (
            <ErrorMessage>{formState.errors.root.message}</ErrorMessage>
          ) : null}

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
    </FormProvider>
  );
};
