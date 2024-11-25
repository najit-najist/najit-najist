'use client';

import { Button } from '@components/common/Button';
import { MunicipalitySelect } from '@components/common/MunicipalitySelect';
import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { FormBreak } from '@components/common/form/FormBreak';
import { loginPageCallbacks } from '@constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyRegistrationFromPreviewInputSchema } from '@server/schemas/verifyRegistrationFromPreviewInputSchema';
import { trpc } from '@trpc/web';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { PasswordInputs } from '../../../_components/PasswordInputs';

export const Form: FC<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const { mutateAsync: finishRegistration } =
    trpc.profile.verifyRegistrationFromPreview.useMutation();
  const formMethods = useForm<
    z.infer<typeof verifyRegistrationFromPreviewInputSchema>
  >({
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
        `/login?${loginPageCallbacks.previewRegistrationFinished}=true`,
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
