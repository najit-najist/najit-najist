'use client';
import { registerInputSchema } from '@najit-najist/api';
import { Button } from '@najit-najist/ui';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from 'trpc';
import { z } from 'zod';

import { BottomLinks } from './components/BottomLInks';
import { Title } from './components/Title';

type FormValues = z.infer<typeof registerInputSchema> & {
  passwordAgain: string;
};

const schema = registerInputSchema.extend({
  passwordAgain: z.string(),
});

const PortalPage: FC = () => {
  const { mutateAsync: doRegister } = trpc.profile.register.useMutation();
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { register, handleSubmit } = formMethods;

  const onSubmit = handleSubmit(async (values) => {
    const result = await doRegister(values);

    console.log({ result });

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
                Email address
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
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
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
                Password again
              </label>
              <div className="mt-1">
                <input
                  id="password-again"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  {...register('passwordAgain')}
                />
              </div>
            </div>

            <div>
              <Button type="submit" size="normal" className="shadow-sm w-full">
                Register
              </Button>
            </div>
          </form>
        </div>
        <BottomLinks />
      </div>
    </div>
  );
};

export default PortalPage;
