import { z } from 'zod';
import { municipalitySchema } from './municipality.schema';
import { userSchema } from './user.schema';
import { zodPassword } from './zodPassword';

export const previewSubscribersTokensSchema = z.object({
  for: userSchema,
  token: z.string(),
});

export const verifyRegistrationFromPreviewInputSchema = z.object({
  token: z.string(),
  password: zodPassword,
  address: z.object({
    municipality: municipalitySchema.pick({ id: true }),
  }),
});

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (
    issue.path[0] === 'address' &&
    issue.path[1] === 'municipality' &&
    !issue.message
  ) {
    return { message: 'Obec je požadována' };
  }

  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export type PreviewSubscribersTokens = z.infer<
  typeof previewSubscribersTokensSchema
>;

export type VerifyRegistrationFromPreviewInput = z.infer<
  typeof verifyRegistrationFromPreviewInputSchema
>;
