'use client';

import { trpc } from '@client/trpc';
import { Button } from '@components/common/Button';
import { PasswordStrengthMeter } from '@components/common/PasswordStrengthMeter';
import { PasswordInput } from '@components/common/form/PasswordInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { finalizeResetPasswordSchema } from '@server/schemas/userProfileResetPasswordInputSchema';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type FormValues = z.infer<typeof finalizeResetPasswordSchema> & {
  passwordAgain: string;
};

const schema = finalizeResetPasswordSchema.extend({
  passwordAgain: z.string(),
});

export const Form: FC<{ token: string }> = ({ token }) => {
  const { mutateAsync: doFinalizePasswordReset } =
    trpc.profile.passwordReset.finalize.useMutation();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      passwordAgain: '',
      token,
    },
  });
  const router = useRouter();
  const { register, handleSubmit, formState, control } = formMethods;
  const fieldsAreDisabled = formState.isSubmitting;

  const onSubmit = handleSubmit(async (values) => {
    await doFinalizePasswordReset(values);

    router.push('/login?passwordResetSuccessful');
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Heslo
        </label>
        <div className="mt-1">
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            error={formState.errors.password}
            disabled={fieldsAreDisabled}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...register('password')}
          />
          <PasswordStrengthMeter fieldName="password" control={control} />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Heslo znovu
        </label>
        <div className="mt-1">
          <PasswordInput
            id="password-again"
            autoComplete="new-password"
            required
            error={formState.errors.password}
            disabled={fieldsAreDisabled}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...register('passwordAgain')}
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          appearance="normal"
          className="shadow-sm w-full"
          disabled={fieldsAreDisabled}
        >
          {fieldsAreDisabled ? 'Odesílám' : 'Změnit heslo'}
        </Button>
      </div>
    </form>
  );
};
