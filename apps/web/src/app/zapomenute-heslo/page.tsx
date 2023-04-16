'use client';
import { registerInputSchema } from '@najit-najist/api';
import { Button, Input } from '@najit-najist/ui';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { BottomLinks } from './_components/BottomLInks';
import { Title } from './_components/Title';

type FormValues = z.infer<typeof registerInputSchema> & {
  passwordAgain: string;
};

const schema = registerInputSchema.extend({
  passwordAgain: z.string(),
});

const PortalPage: FC = () => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { register, handleSubmit, formState } = formMethods;
  const fieldsAreDisabled =
    formState.isSubmitSuccessful || formState.isSubmitting;

  const onSubmit = handleSubmit(async (values) => {
    router.push('/login?passwordResetCallback');
  });

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 mx-auto w-full">
      <Title />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
              <Button type="submit" size="normal" className="shadow-sm w-full">
                Odeslat
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
