'use client';

import { trpc } from '@client/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@najit-najist/ui';
import { resetPasswordSchema } from '@server/schemas/userProfileResetPasswordInputSchema';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type FormValues = z.infer<typeof resetPasswordSchema>;

export const Form: FC = () => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const router = useRouter();
  const { mutateAsync: requestPasswordReset } =
    trpc.profile.passwordReset.do.useMutation();
  const { register, handleSubmit, formState, setError } = formMethods;
  const fieldsAreDisabled =
    formState.isSubmitSuccessful || formState.isSubmitting;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await requestPasswordReset(values);
      router.push('/login?passwordResetCallback');
    } catch (error) {
      setError('email', { message: (error as Error).message });
    }
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
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

      <div>
        <Button
          type="submit"
          appearance="normal"
          className="shadow-sm w-full"
          isLoading={fieldsAreDisabled}
        >
          Odeslat
        </Button>
      </div>
    </form>
  );
};
