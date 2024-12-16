'use client';

import { ACCEPT_FILES_IMAGE } from '@constants';
import { ArrowPathIcon, UserIcon } from '@heroicons/react/24/outline';
import { CameraIcon } from '@heroicons/react/24/solid';
import { User, users } from '@najit-najist/database/models';
import { isFileBase64 } from '@najit-najist/schemas';
import { getFileUrl } from '@server/utils/getFileUrl';
import { updateMyProfileImageAction } from 'app/(with-visible-layout)/muj-ucet/updateMyProfileImageAction';
import Image from 'next/image';
import { useRef, FC, useMemo, useActionState } from 'react';

import { Button } from './Button';

const IMAGE_SIZE = 300;

export const UserAvatarPicker: FC<{ user: Pick<User, 'id' | 'avatar'> }> = ({
  user,
}) => {
  const [state, formAction, isChangingImage] = useActionState(
    updateMyProfileImageAction,
    { message: '' },
  );

  const imageUrl = useMemo(() => {
    const currentImage = state.image ?? user.avatar;

    if (!currentImage) {
      return null;
    }

    if (isFileBase64(currentImage ?? '')) {
      return currentImage ?? '';
    }

    return getFileUrl(users, user.id, currentImage ?? '', {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
    });
  }, [user, state]);

  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeImageClick = () => {
    inputRef.current?.click();
  };

  const content = !imageUrl ? (
    <UserIcon className="absolute top-1/2 left-1/2 text-gray-400 -translate-y-1/2 w-28 h-28 -translate-x-1/2" />
  ) : (
    <Image
      alt="image"
      src={imageUrl}
      width={IMAGE_SIZE}
      height={IMAGE_SIZE}
      unoptimized={imageUrl.startsWith('data:')}
      className="absolute top-0 left-0 w-full h-full object-center object-cover rounded-project shadow-md"
    />
  );

  const editButton = (
    <>
      <Button
        className="absolute bottom-1 right-1 lg:bottom-4 lg:right-4 leading-3 w-16 h-16 !px-1"
        appearance="outlined"
        title="Změnit profilový obrázek"
        type="button"
        onClick={onChangeImageClick}
        disabled={isChangingImage}
      >
        {isChangingImage ? (
          <ArrowPathIcon className="w-7 h-7 animate-spin" />
        ) : (
          <CameraIcon className="w-7 h-7" />
        )}
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        name="image"
        multiple={false}
        accept={ACCEPT_FILES_IMAGE}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      />
    </>
  );

  return (
    <form
      action={formAction}
      className="w-full aspect-square relative bg-gray-100 rounded-project mx-auto max-w-lg"
    >
      {content}
      {editButton}
      {state?.success === false && !isChangingImage ? (
        <div className="text-red-500 rounded-project bg-white after:content-[''] after:bg-white after:rotate-90 after:w-10 after:h-10 absolute bottom-0 translate-y-full z-10 py-3 px-1.5 text-center shadow-lg w-full">
          {state.message}
        </div>
      ) : null}
    </form>
  );
};
