'use client';

import { Alert } from '@components/common/Alert';
import { Badge } from '@components/common/Badge';
import { Button } from '@components/common/Button';
import { Skeleton } from '@components/common/Skeleton';
import { ACCEPT_FILES_IMAGE } from '@constants';
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  PencilIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Product, products } from '@najit-najist/database/models';
import { IMAGE_FILE_REGEX } from '@najit-najist/schemas';
import { getFileUrl } from '@server/utils/getFileUrl';
import { readFile } from '@utils';
import clsx from 'clsx';
import {
  ChangeEventHandler,
  FC,
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FieldError, useController, useFormContext } from 'react-hook-form';

import { CustomImage } from '../CustomImage';
import { ProductFormData } from '../_types';

const isBase64 = (input: string) => input.includes(';base64,');
type ImagePickerProps = {
  onUploadStart: (items: FileList) => void;
  productId?: Product['id'];
  onRemove?: () => void;
  onItemUploadEnd: (incomingValue: string | Error, prevValue?: string) => void;
  error?: FieldError;
  multiple?: boolean;
  value?: string;
  fallback?: ReactNode;
  canBeOnlyEdited?: boolean;
};

const ImagePicker: FC<ImagePickerProps> = ({
  error,
  value,
  onItemUploadEnd,
  onUploadStart,
  fallback,
  multiple,
  canBeOnlyEdited,
  onRemove,
  productId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isPreview = value?.includes('base64,');

  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  const onFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (event) => {
      const files = event.target.files;

      if (!files) {
        return;
      }

      onUploadStart(files);

      for (const file of files) {
        try {
          const uploadedFile = await readFile(file, {
            filter: IMAGE_FILE_REGEX,
            width: 700,
          });
          onItemUploadEnd(uploadedFile, value);
        } catch (error) {
          onItemUploadEnd(error as Error);
        }
      }
    },
    [onItemUploadEnd, onUploadStart, value],
  );

  const src = useMemo(
    () =>
      productId && value
        ? isBase64(value)
          ? value
          : getFileUrl(products, productId, value)
        : value,
    [productId, value],
  );

  return (
    <div
      className={clsx([
        'w-full aspect-square bg-gray-100 text-project-primary rounded-md col-span-3 relative ring-2 ring-offset-2',
        error ? 'ring-red-500' : 'ring-transparent',
      ])}
    >
      {src ? (
        <CustomImage onlyImage src={src} />
      ) : (
        <div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center hover:cursor-pointer"
          onClick={triggerFileSelect}
        >
          {fallback}
        </div>
      )}
      <div className="absolute top-2 right-2 flex gap-2">
        {isPreview ? <Badge color="green">Nový</Badge> : null}
        {value ? (
          <Button
            onClick={triggerFileSelect}
            appearance="spaceless"
            color="blue"
            className="py-1 px-1.5 flex-none"
          >
            <PencilIcon className="w-5 h-5 -mb-1" />
          </Button>
        ) : null}
        {value && !canBeOnlyEdited ? (
          <Button
            onClick={onRemove}
            appearance="spaceless"
            color="red"
            className="py-1 px-1.5 flex-none"
          >
            <TrashIcon className="w-5 h-5 -mb-1" />
          </Button>
        ) : null}
      </div>

      {error?.message ? (
        <Alert
          color="error"
          icon={ExclamationCircleIcon}
          heading={error.message}
          className="max-w-sm absolute bottom-3 left-1/2 -translate-x-1/2"
        />
      ) : null}

      <input
        type="file"
        className="sr-only"
        ref={inputRef}
        onChange={onFileChange}
        accept={ACCEPT_FILES_IMAGE}
        multiple={multiple}
      />
    </div>
  );
};

const FIELD_NAME = 'images';

export const ImagesEdit: FC<{ productId?: number }> = ({ productId }) => {
  const { getValues, resetField } = useFormContext<ProductFormData>();
  const { field, fieldState } = useController<
    Pick<ProductFormData, typeof FIELD_NAME>
  >({
    name: FIELD_NAME,
  });

  const plusIcon = <PlusIcon className="w-16" />;
  const [isMainImageUploading, setIsMainImageUploading] = useState(false);
  const [numberOfUploadingFiles, setNumberOfUploadingFiles] = useState(0);

  const onItemRemove = useCallback(
    (atIndex: number) => {
      const values = getValues(FIELD_NAME);

      // TODO: move this accept into its own state and show accept button in this same button
      if (!confirm('Opravdu vymazat obrázek?')) {
        return;
      }

      if (values.at(atIndex)) {
        // TODO fix this nonsense
        delete values[atIndex];
      }

      resetField('images', {
        defaultValue: [...values].filter(Boolean),
      });
    },
    [getValues, resetField],
  );

  const onFirstUploadStart = useCallback<ImagePickerProps['onUploadStart']>(
    () => setIsMainImageUploading(true),
    [],
  );

  const onUploadMultipleStart = useCallback<ImagePickerProps['onUploadStart']>(
    (items) => {
      setNumberOfUploadingFiles(items.length);
    },
    [],
  );

  const onUploadMultipleItemEnd = useCallback<
    ImagePickerProps['onItemUploadEnd']
  >(
    (pickedFile, prevFile) => {
      if (pickedFile instanceof Error) {
        console.error(pickedFile);
      } else {
        const values = [...(getValues(FIELD_NAME) ?? [])];

        if (prevFile) {
          values[values.findIndex((item) => item === prevFile)] = pickedFile;
        } else {
          values.push(pickedFile);
        }

        if (values.length === 1) {
          setIsMainImageUploading(false);
        }

        field.onChange(values);
        field.onBlur();
      }
      setNumberOfUploadingFiles((prev) => {
        if (!prev) {
          return prev;
        }

        return prev - 1;
      });
    },
    [getValues, field],
  );

  const skeleton = (
    <Skeleton className="w-full animate-pulse col-span-3 aspect-square flex">
      <ArrowPathIcon className="w-12 h-12 animate-spin m-auto" />
    </Skeleton>
  );

  return (
    <>
      {
        <ImagePicker
          canBeOnlyEdited
          productId={productId}
          error={fieldState.error}
          onUploadStart={onFirstUploadStart}
          value={field.value?.at(0)}
          onItemUploadEnd={onUploadMultipleItemEnd}
          fallback={
            isMainImageUploading ? (
              <ArrowPathIcon className="w-28 animate-spin" />
            ) : (
              <div className="text-center">
                <PhotoIcon className="w-28 mx-auto" />
                <p className="text-black">Vložte kliknutím...</p>
              </div>
            )
          }
        />
      }
      <div className="grid grid-cols-6 gap-3 mt-3">
        {((field.value as string[]) ?? []).slice(1).map((imageUrl, index) => (
          <ImagePicker
            key={imageUrl}
            value={imageUrl}
            productId={productId}
            onRemove={() => onItemRemove(index + 1)}
            onUploadStart={onUploadMultipleStart}
            onItemUploadEnd={onUploadMultipleItemEnd}
          />
        ))}
        {Array.from(new Array(numberOfUploadingFiles).fill('')).map(
          (_, key) => (
            <Fragment key={key}>{skeleton}</Fragment>
          ),
        )}
        {field.value?.length >= 1 ? (
          <ImagePicker
            onUploadStart={onUploadMultipleStart}
            onItemUploadEnd={onUploadMultipleItemEnd}
            multiple
            fallback={plusIcon}
          />
        ) : null}
      </div>
    </>
  );
};
