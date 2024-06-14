'use client';

import { trpc } from '@client/trpc';
import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { UserWithRelations } from '@custom-types';
import { Alert } from '@najit-najist/ui';
import { getChangedValues } from '@utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, ReactNode, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

export const Content: FC<{
  user: UserWithRelations;
  asideContent?: ReactNode;
}> = ({ user, asideContent }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { mutateAsync: updateProfile } = trpc.users.update.useMutation();
  const formMethods = useForm<UserWithRelations>({
    defaultValues: user,
  });
  const { handleSubmit, formState, reset } = formMethods;

  const onSubmit: SubmitHandler<UserWithRelations> = useCallback(
    async (values) => {
      const nextValues = getChangedValues(values, formState.dirtyFields);

      // TODO provide correct typings
      if (nextValues.address && user.address?.id) {
        nextValues.address.id = user.address?.id;
      }

      await updateProfile({
        id: user.id,
        payload: {
          ...nextValues,
          telephone: nextValues.telephone ?? undefined,
          address: nextValues.address ?? undefined,
        },
      });
      reset(undefined, { keepValues: true });
    },
    [formState.dirtyFields, reset, updateProfile, user.address?.id, user.id]
  );

  const onDismissClick = () => {
    const newSearchParams = new URLSearchParams([
      ...(searchParams?.entries() ?? []),
    ]);

    newSearchParams.delete('failed-to-delete');

    router.replace(`${pathname}?${newSearchParams?.toString()}`);
  };

  return (
    <FormProvider {...formMethods}>
      {searchParams?.get('failed-to-delete') !== null ? (
        <div className="container mx-auto mt-4">
          <Alert
            color="error"
            heading="Uživatel nemohl být vymazán kvůli chybám na serveru"
            onDismissClick={onDismissClick}
          />
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container grid grid-cols-1 md:grid-cols-6 mx-auto my-5"
      >
        <EditUserUnderPage
          viewType="edit"
          userId={user.id}
          afterProfileImageSlot={asideContent}
        />
      </form>
    </FormProvider>
  );
};
