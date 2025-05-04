import { z } from 'zod';

export const updatePrivacyPolicySettingsActionInputSchema = z.object({
  analytics: z
    .boolean()
    .or(z.string().transform((value) => value === 'on' || value === 'true'))
    .default(false),
  marketing: z
    .boolean()
    .or(z.string().transform((value) => value === 'on' || value === 'true'))
    .default(false),
});

export type UpdatePrivacyPolicySettingsActionInput = z.input<
  typeof updatePrivacyPolicySettingsActionInputSchema
>;
