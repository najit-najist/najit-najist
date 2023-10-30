'use client';

import { Button, Input } from '@najit-najist/ui';
import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';

export const Form: FC = () => {
  const { mutateAsync } = useMutation({
    mutationKey: ['upload-static-file'],
    mutationFn: async (data: FormData) => {
      const upload = await fetch(
        new URL('/api/static-assets/upload/videos', window.location.origin),
        {
          method: 'POST',
          body: data,
        }
      );

      if (!upload.ok) {
        throw new Error('Not ok from response');
      }

      const content = await upload.json();

      if (!content.success) {
        throw new Error('Upload file not successful on server');
      }
    },
  });
  const formMethods = useForm<{ contents: File }>();
  const { handleSubmit, formState, setError } = formMethods;
  const { field: contentsField, fieldState: contentsFieldState } =
    useController({
      name: 'contents',
      control: formMethods.control,
      rules: { required: 'Požadováno' },
    });

  const handleOnSubmit: Parameters<typeof handleSubmit>[0] = async ({
    contents,
  }) => {
    try {
      const formData = new FormData();

      formData.append('contents', contents);

      await mutateAsync(formData);
    } catch (error) {
      if (error instanceof Error) {
        setError('contents', { message: error.message });
      }

      throw error;
    }
  };

  return (
    <FormProvider {...formMethods}>
      <h2>Videos upload</h2>
      <form className="flex gap-5" onSubmit={handleSubmit(handleOnSubmit)}>
        <Input
          value={(contentsField.value as any)?.fileName}
          type="file"
          multiple={false}
          disabled={formState.isSubmitting}
          error={contentsFieldState.error}
          onBlur={contentsField.onBlur}
          name={contentsField.name}
          onChange={(event) => {
            contentsField.onChange(event.target.files?.[0]);
          }}
        />

        <Button type="submit" isLoading={formState.isSubmitting}>
          Odeslat
        </Button>
      </form>
    </FormProvider>
  );
};
