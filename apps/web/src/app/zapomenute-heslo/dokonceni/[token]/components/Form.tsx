'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { finalizeResetPasswordSchema } from '@najit-najist/api';
import { Button, PasswordInput } from '@najit-najist/ui';
import { trpc } from '@trpc';
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
  const { register, handleSubmit } = formMethods;

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
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...register('password')}
          />
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
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...register('passwordAgain')}
          />
        </div>
      </div>

      <div>
        <Button type="submit" appearance="normal" className="shadow-sm w-full">
          Změnit heslo
        </Button>
      </div>
    </form>
  );
};
