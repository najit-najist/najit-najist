import { z } from 'zod';

const formDataToObject = (formData: FormData) =>
  Object.fromEntries(formData.entries());

export const validateFormData = <TSchema extends z.ZodSchema>(
  formData: FormData,
  schema: TSchema,
) => {
  const values = formDataToObject(formData);

  return schema.safeParse(values) as ReturnType<TSchema['safeParse']>;
};

export const validateFormDataAsync = <TSchema extends z.ZodSchema>(
  formData: FormData,
  schema: TSchema,
) => {
  const values = formDataToObject(formData);

  return schema.safeParseAsync(values) as ReturnType<TSchema['safeParseAsync']>;
};
