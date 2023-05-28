import { Recipe } from '@schemas';

export const extractTimeFromSteps = (steps: Recipe['steps']) =>
  steps.reduce(
    (finalValue, { parts }) =>
      finalValue +
      parts.reduce(
        (partsFinalValue, { duration }) => partsFinalValue + duration,
        0
      ),
    0
  );
