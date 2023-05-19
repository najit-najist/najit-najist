import { CameraIcon, PhotoIcon } from '@heroicons/react/24/solid';
import { User, getFileUrl, AvailableModels } from '@najit-najist/api';
import Image from 'next/image';
import { useRef, ChangeEventHandler, FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

const AvatarSelect = () => {
  const { setValue } = useFormContext<User>();
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeImageClick = () => {
    inputRef.current?.click();
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        if (!reader.result) {
          return;
        }

        setValue('avatar', reader.result as string);
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <button
        className="absolute bottom-4 right-4 bg-white rounded-full p-3 border-2 border-gray-100"
        title="Změnit profilový obrázek"
        type="button"
        onClick={onChangeImageClick}
      >
        <CameraIcon className="w-7 h-7" />
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={onFileChange}
      />
    </>
  );
};

const Avatar: FC<{ userId?: string }> = ({ userId }) => {
  const { watch } = useFormContext();

  const avatar = watch('avatar');

  const isPreview = useMemo(() => {
    const [, probableBase64] = (avatar ?? '').split(';');

    if (!probableBase64) {
      return false;
    }

    // Little bit hacky but works
    return probableBase64.startsWith('base64,');
  }, [avatar]);

  const imageUrl = useMemo(() => {
    if (isPreview || !userId) {
      return avatar ?? '';
    }

    return getFileUrl(AvailableModels.USER, userId, avatar ?? '', {
      width: 200,
      height: 200,
    });
  }, [avatar, isPreview, userId]);

  if (!avatar) {
    return (
      <PhotoIcon className="absolute top-1/2 left-1/2 text-gray-600 -translate-y-1/2 w-20 h-20 -translate-x-1/2" />
    );
  }

  return (
    <Image
      alt="image"
      src={imageUrl}
      width={100}
      height={100}
      unoptimized={!isPreview}
      className="absolute top-0 left-0 w-full h-full object-center object-cover rounded-full"
    />
  );
};

export const UserAvatarPicker: FC<{ userId?: string }> = ({ userId }) => {
  return (
    <div className="w-full aspect-square relative bg-gray-100 rounded-full">
      <Avatar userId={userId} />
      <AvatarSelect />
    </div>
  );
};
