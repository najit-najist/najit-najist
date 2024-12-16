import { zodErrorToFormErrors } from '@utils/zodErrorToFormErrors';
import { FieldError } from 'react-hook-form';
import { z } from 'zod';

import { isNextNotFound } from './isNextNotFound';
import { isNextRedirect } from './isNextRedirect';

export function createActionWithValidation<
  S extends z.Schema,
  I extends z.input<S> | FormData,
  O extends z.output<S>,
  R extends Promise<any> | any,
>(
  schema: S,
  action: (input: O) => R,
  options?: {
    onValidationError?: (
      validationResult: z.SafeParseReturnType<I, O>,
      input: I,
    ) => Promise<any>;
    onHandlerError?: (error: Error, input: O) => void | Promise<void>;
  },
) {
  return async (
    input: I,
  ): Promise<
    | (Awaited<R> & { errors?: Record<string, FieldError> })
    | (Partial<Awaited<R>> & { errors: Record<string, FieldError> })
  > => {
    const inputAsObject =
      input instanceof FormData ? Object.fromEntries(input) : input;
    const validated = await schema.safeParseAsync(inputAsObject);

    if (!validated.success) {
      await Promise.resolve(options?.onValidationError?.(validated, input));
      const errors = zodErrorToFormErrors(validated.error.errors, true);

      if (errors['']) {
        errors['root'] = { ...errors[''] };
        delete errors[''];
      }

      return {
        errors,
      } as any;
    }

    try {
      return (await action(validated.data)) as any;
    } catch (error) {
      if (
        error instanceof Error &&
        !isNextRedirect(error) &&
        !isNextNotFound(error)
      ) {
        await Promise.resolve(
          options?.onHandlerError?.(error as Error, validated.data),
        );
      }

      throw error;
    }
  };
}
