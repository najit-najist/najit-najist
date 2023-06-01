'use client';

import { ACCEPT_FILES_IMAGE } from '@constants';
import { ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline';
import {
  AvailableModels,
  getFileUrl,
  IMAGE_FILE_REGEX,
  isFileBase64,
  Post,
} from '@najit-najist/api';
import { readFile } from '@utils';
import Image from 'next/image';
import { ChangeEventHandler, FC, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const FIELD_NAME = 'image';

export const ImageEdit: FC<{ postId?: Post['id'] }> = ({ postId }) => {
  const [isLoadingIntoMemory, setIsLoadingIntoMemory] = useState(false);
  const { watch, setValue, setError } = useFormContext<Post>();
  const value = watch(FIELD_NAME);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeImageClick = () => {
    inputRef.current?.click();
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const files = event.target.files;

    if (!files?.length) {
      return;
    }

    const file = Array.from(files)[0];
    setIsLoadingIntoMemory(true);
    try {
      setValue(
        FIELD_NAME,
        await readFile(file, { filter: IMAGE_FILE_REGEX, width: 600 })
      );
    } catch (error) {
      setError(FIELD_NAME, {
        message: (error as Error).message,
      });
    }
    setIsLoadingIntoMemory(false);
  };

  const imageUrl = useMemo(() => {
    if (isFileBase64(value ?? '') || !postId) {
      return value ?? '';
    }

    return getFileUrl(AvailableModels.POST, postId, value ?? '', {
      width: 200,
      height: 200,
    });
  }, [value, postId]);

  const content = value ? (
    <Image
      alt="image"
      src={imageUrl}
      width={200}
      height={200}
      unoptimized={imageUrl.startsWith('data:')}
      className="absolute top-0 left-0 w-full h-full object-center object-cover"
      onClick={onChangeImageClick}
    />
  ) : (
    <div
      className="absolute w-full h-full flex items-center justify-center bg-white cursor-pointer"
      onClick={onChangeImageClick}
    >
      <div className="text-center text-green-600">
        {isLoadingIntoMemory ? (
          <ArrowPathIcon className=" w-20 h-20 mx-auto animate-spin" />
        ) : (
          <PhotoIcon className=" w-20 h-20 mx-auto" />
        )}
        <p className="text-gray-400">Upravte kliknutím...</p>
      </div>
    </div>
  );

  return (
    <>
      {content}
      <input
        disabled={isLoadingIntoMemory}
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={onFileChange}
        accept={ACCEPT_FILES_IMAGE}
      />
    </>
  );
};
