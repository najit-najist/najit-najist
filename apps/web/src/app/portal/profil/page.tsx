'use client';
import { useCurrentUser } from '@hooks';
import { Switch, Button } from '@najit-najist/ui';
import { FC, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from './components/Input';
import { Section } from './components/Section';

const ProfilePage: FC = () => {
  const { data: user } = useCurrentUser();
  const formData = useForm({
    defaultValues: user,
  });
  const { register, control, handleSubmit } = formData;

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    (value) => {},
    []
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white rounded-lg border-2 border-gray-100"
    >
      <div className="px-10 sm:px-20 py-5 w-full space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <Section
          title="Profil"
          description="Toto jsou Vaše informace o Vašem profilu."
        >
          <Input label="Jméno" {...register('firstName')} />
          <Input label="Příjmení" {...register('lastName')} />
          <Input label="Email" {...register('email')} />
          <Input
            label="Telefon"
            prefix="+420"
            inputMode="numeric"
            autoComplete="tel-local"
            {...register('telephoneNumber')}
          />

          <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="photo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Photo
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <div className="flex items-center">
                <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="ml-5 rounded-md bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Newsletter" description="">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              Odebírat newsletter
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <Controller
                name="newsletter"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Switch onChange={onChange} value={value} />
                )}
              />
            </div>
          </div>
        </Section>
      </div>
      <div className="px-10 sm:px-20 py-5 border-t border-gray-200">
        <div className="flex justify-end gap-x-3">
          <Button type="submit">Uložit</Button>
        </div>
      </div>
    </form>
  );
};

export default ProfilePage;
