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
  options?: {
    onValidationError?: (
      validationResult: z.SafeParseReturnType<I, O>,
      input: I
    ) => Promise<any>;
    onHandlerError?: (error: Error, input: O) => void | Promise<void>;
  }
) {
  return async (
    input: I
  ): Promise<{ errors: Record<string, FieldError> } | Awaited<R>> => {
    const validated = await schema.safeParseAsync(input);

    if (!validated.success) {
      await Promise.resolve(options?.onValidationError?.(validated, input));
      const errors = zodErrorToFormErrors(validated.error.errors, true);

      if (errors['']) {
        errors['root'] = { ...errors[''] };
        delete errors[''];
      }

      return {
        errors,
      };
    }

    try {
      return await action(validated.data);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !== 'NEXT_REDIRECT' &&
        error.message !== 'NEXT_NOT_FOUND'
      ) {
        await Promise.resolve(
          options?.onHandlerError?.(error as Error, validated.data)
        );
      }

      throw error;
    }
  };
}
