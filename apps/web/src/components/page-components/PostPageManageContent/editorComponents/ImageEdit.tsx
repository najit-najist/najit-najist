'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';
import { AvailableModels, getFileUrl, Post } from '@najit-najist/api';
import Image from 'next/image';
import { ChangeEventHandler, FC, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

export const ImageEdit: FC<{ postId?: Post['id'] }> = ({ postId }) => {
  const { watch, setValue } = useFormContext<Post>();
  const value = watch('image');
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

        setValue('image', reader.result as string);
      };

      reader.readAsDataURL(file);
    });
  };

  const isPreview = useMemo(() => {
    const [, probableBase64] = (value ?? '').split(';');

    if (!probableBase64) {
      return false;
    }

    // Little bit hacky but works
    return probableBase64.startsWith('base64,');
  }, [value]);

  const imageUrl = useMemo(() => {
    if (isPreview || !postId) {
      return value ?? '';
    }

    return getFileUrl(AvailableModels.POST, postId, value ?? '', {
      width: 200,
      height: 200,
    });
  }, [value, isPreview, postId]);

  const content = value ? (
    <Image
      alt="image"
      src={imageUrl}
      width={200}
      height={200}
      unoptimized={!isPreview}
      className="absolute top-0 left-0 w-full h-full object-center object-cover"
      onClick={onChangeImageClick}
    />
  ) : (
    <div className="absolute w-full h-full flex items-center justify-center bg-white">
      <div className="text-center">
        <PhotoIcon
          className="text-gray-600 w-20 h-20 mx-auto"
          onClick={onChangeImageClick}
        />
        <p>Upravte kliknutím</p>
      </div>
    </div>
  );

  return (
    <>
      {content}
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={onFileChange}
      />
    </>
  );
};
