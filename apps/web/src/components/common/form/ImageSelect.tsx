import { PhotoIcon } from '@heroicons/react/24/outline';
import { cva, cx, VariantProps } from 'class-variance-authority';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import Image from 'next/image';
import { FC, useCallback, useId, useMemo } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

import { Badge } from '../Badge';
import { getFileUrl } from '../internal/getFileUrl';
import { FormControlWrapper } from './FormControlWrapper';

export interface ImageSelectProps
  extends Omit<VariantProps<typeof rootStyles>, 'size'> {
  name: string;
  label?: string;
  error?: string;
  wrapperClassName?: string;
  value?: string[];
  /**
   * Parent id under which are images added
   */
  parentId?: number;
  /**
   * Model Name
   */
  model: PgTableWithColumns<any>;
  onChange?: (nextValue: string[]) => void;
}

const rootStyles = cva(
  'flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 bg-white w-full',
  {
    variants: {
      size: {
        small: 'py-5',
        normal: 'py-10',
      },
    },
    defaultVariants: {
      size: 'normal',
    },
  },
);

const PreviewImage: FC<
  { src: string } & Pick<ImageSelectProps, 'parentId' | 'model'>
> = ({ src, parentId, model }) => {
  const imageIsBase64 = useMemo(() => {
    const [, probableBase64] = src.split(';');

    if (!probableBase64) {
      return false;
    }

    // Little bit hacky but works
    return probableBase64.startsWith('base64,');
  }, [src]);

  const url = useMemo(() => {
    if (imageIsBase64 || !parentId) {
      return src;
    }

    return getFileUrl(model, parentId, src, { width: 100, height: 100 });
  }, [src, parentId, imageIsBase64, model]);

  return (
    <div className="relative aspect-square rounded-md overflow-hidden">
      <Image
        alt="image"
        src={url}
        width={100}
        height={100}
        unoptimized={!imageIsBase64}
        className="absolute top-0 left-0 w-full h-full object-center object-cover"
      />
      <div className="absolute top-0 right-0 m-1">
        {imageIsBase64 ? <Badge color="green">Nový</Badge> : null}
      </div>
    </div>
  );
};

export const ImageSelect: FC<ImageSelectProps> = ({
  wrapperClassName,
  label,
  error,
  name,
  onChange,
  parentId,
  model,
  value,
}) => {
  const inputId = useId();
  const filesArePicked = !!value?.length;

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    async (acceptedFiles) => {
      const allFiles: ImageSelectProps['value'] = [];

      acceptedFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          if (!reader.result) {
            return;
          }

          allFiles.push(reader.result as string);

          if (index === acceptedFiles.length - 1) {
            onChange?.([...(value ?? []), ...allFiles]);
          }
        };

        reader.readAsDataURL(file);
      });
    },
    [],
  );

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
  });

  return (
    <FormControlWrapper
      className={wrapperClassName}
      title={label}
      error={error}
      id={inputId}
    >
      <div className="grid grid-cols-7 mb-3 gap-3 my-4">
        {value?.map((value) => (
          <PreviewImage
            key={value}
            src={value}
            model={model}
            parentId={parentId}
          />
        ))}
      </div>

      <div
        {...getRootProps({
          className: rootStyles({
            size: filesArePicked ? 'small' : 'normal',
          }),
        })}
      >
        <div
          className={cx(
            'text-center',
            filesArePicked ? 'flex items-center gap-5' : 'py-8',
          )}
        >
          <PhotoIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="text-center">
            <div
              className={cx(
                'flex text-sm leading-6 text-gray-600',
                filesArePicked ? '' : 'mt-4',
              )}
            >
              <label
                htmlFor={inputId}
                className="relative cursor-pointer rounded-md bg-white font-semibold text-project-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-project-primary focus-within:ring-offset-2 hover:text-project-primary"
              >
                <span>Nahrát obrázek</span>
                <input
                  id={inputId}
                  name={name}
                  type="file"
                  className="sr-only"
                  {...getInputProps()}
                />
              </label>
              <p className="pl-1">nebo přetáhněte sem</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF max velikost 2MB
            </p>
          </div>
        </div>
      </div>
    </FormControlWrapper>
  );
};
