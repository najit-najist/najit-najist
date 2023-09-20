import { ACCEPT_FILES_IMAGE } from '@constants';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/solid';
import {
  getFileUrl,
  AvailableModels,
  IMAGE_FILE_REGEX,
  isFileBase64,
} from '@najit-najist/api';
import { readFile } from '@utils';
import Image from 'next/image';
import { useRef, ChangeEventHandler, FC, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const FIELD_NAME = 'avatar';
const IMAGE_SIZE = 300;

const AvatarSelect = () => {
  const [isUploadingToMemory, setIsUploadingToMemory] = useState(false);
  const { setValue, setError, formState } = useFormContext<{
    avatar?: string;
  }>();
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeImageClick = () => {
    inputRef.current?.click();
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = event.target.files;
    const [file] = files ?? [];

    if (!file) {
      return;
    }

    setIsUploadingToMemory(true);
    try {
      setValue(
        FIELD_NAME,
        await readFile(file, { filter: IMAGE_FILE_REGEX, width: 450 }),
        {
          shouldDirty: true,
          shouldTouch: true,
        }
      );
    } catch (error) {
      setError(FIELD_NAME, {
        message: (error as Error).message,
      });
    } finally {
      setIsUploadingToMemory(false);
    }
  };

  return (
    <>
      <button
        className="absolute bottom-1 right-1 lg:bottom-4 lg:right-4 bg-white rounded-full p-3 border-2 border-gray-100"
        title="Změnit profilový obrázek"
        type="button"
        onClick={onChangeImageClick}
        disabled={isUploadingToMemory || formState.isSubmitting}
      >
        {isUploadingToMemory ? (
          <ArrowPathIcon className="w-7 h-7 animate-spin" />
        ) : (
          <CameraIcon className="w-7 h-7" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={onFileChange}
        accept={ACCEPT_FILES_IMAGE}
      />
    </>
  );
};

const Avatar: FC<{ userId?: string }> = ({ userId }) => {
  const { watch, formState } = useFormContext<{ avatar?: string }>();
  const avatar = watch(FIELD_NAME);

  const imageUrl = useMemo(() => {
    if (isFileBase64(avatar ?? '') || !userId) {
      return avatar ?? '';
    }

    return getFileUrl(AvailableModels.USER, userId, avatar ?? '', {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
    });
  }, [avatar, userId]);

  const content = !avatar ? (
    <PhotoIcon className="absolute top-1/2 left-1/2 text-gray-600 -translate-y-1/2 w-20 h-20 -translate-x-1/2" />
  ) : (
    <Image
      alt="image"
      src={imageUrl}
      width={IMAGE_SIZE}
      height={IMAGE_SIZE}
      unoptimized={imageUrl.startsWith('data:')}
      className="absolute top-0 left-0 w-full h-full object-center object-cover rounded-full"
    />
  );

  return (
    <>
      {content}
      {formState.errors.avatar ? (
        <div className="text-red-500 rounded-md bg-white after:content-[''] after:bg-white after:rotate-90 after:w-10 after:h-10 absolute bottom-0 translate-y-full z-10">
          {formState.errors.avatar.message}
        </div>
      ) : null}
    </>
  );
};

export const UserAvatarPicker: FC<{ userId?: string }> = ({ userId }) => {
  return (
    <div className="w-full aspect-square relative bg-gray-100 rounded-full mx-auto max-w-lg">
      <Avatar userId={userId} />
      <AvatarSelect />
    </div>
  );
};
