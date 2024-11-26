import { ErrorMessages } from '@custom-types';

export const formatErrorMessage = (
  message: ErrorMessages,
  data?: Record<string, any>,
) => {
  let finalMessage = String(message);

  for (const variableKey in data) {
    finalMessage = finalMessage.replaceAll(
      `{${variableKey}}`,
      data[variableKey],
    );
  }

  return finalMessage;
};
