'use client';

import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfile, updateProfileSchema, User } from '@najit-najist/api';
import { trpc } from '@trpc';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useCallback } from 'react';
import {
  FormProvider,
  FormState,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

const navigationItems = [
  {
    label: 'Můj profil',
    href: '/muj-ucet/profil',
  },
  {
    label: 'Moje objednávky',
    href: '/muj-ucet/objednavky',
    count: 2,
  },
];

export function getChangedValues<G extends Record<any, any>>(
  allValues: G,
  dirtyFields: FormState<G>['dirtyFields'] | true
): Partial<G> {
  if (dirtyFields === true || Array.isArray(dirtyFields)) return allValues;

  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [
      key,
      getChangedValues(allValues[key], dirtyFields[key] as any),
    ])
  ) as Partial<G>;
}

export const Content: FC<{
  initialData: UpdateProfile;
  userId: User['id'];
}> = ({ initialData, userId }) => {
  const pathname = usePathname();
  const { mutateAsync: updateProfile } = trpc.profile.update.useMutation();
  const formMethods = useForm<UpdateProfile>({
    defaultValues: initialData,
    resolver: zodResolver(updateProfileSchema),
  });
  const { handleSubmit, formState, reset } = formMethods;

  const onSubmit: SubmitHandler<z.input<typeof updateProfileSchema>> =
    useCallback(
      async (values) => {
        const nextValues = getChangedValues(values, formState.dirtyFields);

        // TODO provide correct typings
        // @ts-ignore
        if (nextValues.address && initialData.address?.id) {
          // @ts-ignore
          nextValues.address.id = initialData.address?.id;
        }

        await updateProfile(nextValues);
        reset(undefined, { keepValues: true });
      },
      [updateProfile, initialData, formState.dirtyFields, reset]
    );

  const userMenu = (
    <nav className="flex flex-1 flex-col mx-auto mt-10" aria-label="Sidebar">
      <ul role="list" className="-mx-2 space-y-1">
        {navigationItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href as any}
              className={clsx(
                pathname === item.href
                  ? 'bg-gray-100 text-project-accent'
                  : 'text-gray-700 hover:text-project-accent hover:bg-gray-50',
                'group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
              )}
            >
              {item.label}
              {item.count ? (
                <span
                  className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                  aria-hidden="true"
                >
                  {item.count}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <FormProvider {...formMethods}>
      <EditUserUnderPage
        onSubmit={handleSubmit(onSubmit)}
        viewType="edit-myself"
        userId={userId}
        afterProfileImageSlot={userMenu}
      />
    </FormProvider>
  );
};
