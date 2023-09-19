'use client';

import { Button, buttonStyles } from '@najit-najist/ui';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { ViewType } from './_types';
import clsx from 'clsx';

const EditorContent: FC = () => {
  const { formState } = useFormContext();

  return (
    <>
      <Button
        className="ml-auto"
        type="submit"
        isLoading={formState.isSubmitting}
      >
        Uložit
      </Button>
    </>
  );
};

export const EditorHeader: FC<{ viewType: ViewType }> = ({ viewType }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorEnabled = viewType === 'edit';
  const href = `${pathname}${isEditorEnabled ? '' : '?editor=true'}`;

  const onLinkClick = () => {
    router.refresh();
  };

  return (
    <div
      className={clsx(
        'bottom-0 left-0 fixed z-20 w-full bg-white border-t-2 border-gray-100'
      )}
    >
      <div className="container mx-auto my-2 flex">
        {viewType !== 'create' ? (
          <Link
            href={href as any}
            onClick={onLinkClick}
            className={buttonStyles({
              color: isEditorEnabled ? 'red' : 'normal',
            })}
          >
            {isEditorEnabled ? 'Ukončit úpravu' : 'Upravit'}
          </Link>
        ) : null}
        {isEditorEnabled || viewType === 'create' ? <EditorContent /> : null}
      </div>
    </div>
  );
};
