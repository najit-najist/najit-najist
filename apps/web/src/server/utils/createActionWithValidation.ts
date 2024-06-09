import { zodErrorToFormErrors } from '@utils/zodErrorToFormErrors';
import { FieldError } from 'react-hook-form';
import { z } from 'zod';

export function createActionWithValidation<
  S extends z.Schema,
  I extends z.input<S>,
  O extends z.output<S>,
  R extends Promise<any> | any
>(
  schema: S,
  action: (input: O) => R,
  onError?: (
    validationResult: z.SafeParseReturnType<I, O>,
    input: I
  ) => Promise<any>
) {
  return async (
    input: I
  ): Promise<{ errors: Record<string, FieldError> } | Awaited<R>> => {
    const validated = await schema.safeParseAsync(input);

    if (!validated.success) {
      await Promise.resolve(onError?.(validated, input));
      const errors = zodErrorToFormErrors(validated.error.errors, true);

      if (errors['']) {
        errors['root'] = { ...errors[''] };
        delete errors[''];
      }

      return {
        errors,
      };
    }

    return await action(validated.data);
  };
}
