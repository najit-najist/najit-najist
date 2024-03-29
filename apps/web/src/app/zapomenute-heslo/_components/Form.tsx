'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@najit-najist/api';
import { Button, Input } from '@najit-najist/ui';
import { trpc } from '@trpc';
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
  const { register, handleSubmit, formState } = formMethods;
  const fieldsAreDisabled =
    formState.isSubmitSuccessful || formState.isSubmitting;

  const onSubmit = handleSubmit(async (values) => {
    await requestPasswordReset(values);

    router.push('/login?passwordResetCallback');
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
