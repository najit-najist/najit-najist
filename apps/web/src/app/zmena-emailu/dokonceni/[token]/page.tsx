'use client';
import { Button, PasswordInput } from '@najit-najist/ui';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from 'trpc';
import { z } from 'zod';

import { BottomLinks } from './_components/BottomLinks';
import { Title } from './_components/Title';
import { registerUserSchema } from '@najit-najist/api';

type FormValues = z.infer<typeof registerUserSchema> & {
  passwordAgain: string;
};

const schema = registerUserSchema.extend({
  passwordAgain: z.string(),
});

const ChangeEmailFinalizationPage: FC = () => {
  const { mutateAsync: doRegister } = trpc.profile.register.useMutation();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { register, handleSubmit } = formMethods;

  const onSubmit = handleSubmit(async (values) => {
    await doRegister(values);

    router.push('/login');
  });

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Emailová adresa
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  {...register('email')}
                />
              </div>
            </div>

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
              <Button
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
  );
};

export default ChangeEmailFinalizationPage;
