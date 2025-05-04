'use server';

import { SubmissionResult } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { updatePrivacyPolicySettingsActionInputSchema } from 'schemas/updatePrivacyPolicySettingsActionInputSchema';

import { setConsentState } from './consentState';

export const consentFormAction = async (
  previousState: SubmissionResult<string[]> | undefined,
  formData: FormData,
): Promise<SubmissionResult<string[]> | undefined> => {
  const submission = parseWithZod(formData, {
    schema: updatePrivacyPolicySettingsActionInputSchema,
  });

  if (submission.status === 'success') {
    await setConsentState({
      ...submission.value,
      version: 1,
    });
  }

  return submission.reply();
};
