'use client';

import { PhotoIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { AvailableModels, getFileUrl, Recipe } from '@najit-najist/api';
import { ChangeEventHandler, FC, PropsWithChildren, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { CustomImage } from '../CustomImage';

const isBase64 = (input: string) => input.includes(';base64,');

const ImagePicker: FC<
  PropsWithChildren<{ onChange: (incomingValue: string) => void }>
> = ({ onChange, children }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onClick = () => {
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

        onChange(reader.result as string);
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full aspect-square flex items-center justify-center bg-gray-100 text-deep-green-400 rounded-md col-span-2 hover:cursor-pointer"
    >
      {children}
      <input
        type="file"
        className="sr-only"
        ref={inputRef}
        onChange={onFileChange}
      />
    </button>
  );
};

export const ImagesEdit: FC<{ recipeId?: string }> = ({ recipeId }) => {
  const plusIcon = <PlusIcon className="w-16" />;
  return (
    <>
      <Controller
        name="images.0"
        render={({ field: { value, onChange } }) =>
          value ? (
            <CustomImage
              src={
                recipeId
                  ? isBase64(value)
                    ? value
                    : getFileUrl(AvailableModels.RECIPES, recipeId, value)
                  : value
              }
            />
          ) : (
            <ImagePicker onChange={onChange}>
              <PhotoIcon className="w-28" />
            </ImagePicker>
          )
        }
      />
      <div className="grid grid-cols-6 gap-3 mt-3">
        <Controller<Pick<Recipe, 'images'>>
          name="images"
          render={({ field: { value, onChange } }) => (
            <>
              {(typeof value === 'string' ? [value] : value)
                .slice(1, -1)
                .map((imageUrl) => (
                  <CustomImage
                    key={imageUrl}
                    src={
                      recipeId
                        ? isBase64(imageUrl)
                          ? imageUrl
                          : getFileUrl(
                              AvailableModels.RECIPES,
                              recipeId,
                              imageUrl
                            )
                        : imageUrl
                    }
                  />
                ))}
              <ImagePicker
                onChange={(pickedFile) =>
                  onChange([...(value as string[]), pickedFile])
                }
              >
                {plusIcon}
              </ImagePicker>
            </>
          )}
        />
      </div>
    </>
  );
};
