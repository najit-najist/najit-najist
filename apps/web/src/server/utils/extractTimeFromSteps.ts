import { RecipeStep } from '@najit-najist/database/models';

export const extractTimeFromSteps = (steps: RecipeStep[]) =>
  steps.reduce(
    (finalValue, { parts }) =>
      finalValue +
      parts.reduce(
        (partsFinalValue, { duration }) => partsFinalValue + duration,
        0,
      ),
    0,
  );
