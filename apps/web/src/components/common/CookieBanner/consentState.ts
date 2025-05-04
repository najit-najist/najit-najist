import { logger } from '@logger/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const ANALYTICS_CONSENT_COOKIE_NAME = 'enable-najit-najist-analytics';
const MARKETING_CONSENT_COOKIE_NAME = 'enable-najit-najist-marketing';
const COOKIE_CONSENT_SHOWN = 'najit-najist-cookie-consent-shown';

const NEW_COOKIE_NAME = 'najit-najist-privacy-consent';

enum ConsentProperties {
  ANALYTICS = 'analytics',
  SHOWN = 'shown',
  MARKETING = 'marketing',
  CONSENTED_AT = 'at',
  CONSENT_VERSION = 'version',
}

const schema = z.object({
  [ConsentProperties.ANALYTICS]: z.boolean().default(false),
  [ConsentProperties.SHOWN]: z.boolean().default(false),
  [ConsentProperties.MARKETING]: z.boolean().default(false),
  [ConsentProperties.CONSENTED_AT]: z.coerce.date().optional(),
  [ConsentProperties.CONSENT_VERSION]: z.coerce.number().default(1),
});

export const getConsentState = async () => {
  const store = await cookies();
  let payload: Partial<z.output<typeof schema>> = {};
  const newCookieValue = store.get(NEW_COOKIE_NAME)?.value;
  const hasLegacyValues =
    store.get(COOKIE_CONSENT_SHOWN)?.value === 'true' ||
    store.get(COOKIE_CONSENT_SHOWN)?.value === 'false';

  if (hasLegacyValues) {
    payload['analytics'] = !!store.get(ANALYTICS_CONSENT_COOKIE_NAME)?.value;
    payload['marketing'] = !!store.get(MARKETING_CONSENT_COOKIE_NAME)?.value;
    payload['shown'] = !!store.get(COOKIE_CONSENT_SHOWN)?.value;
  } else if (newCookieValue) {
    try {
      payload = JSON.parse(newCookieValue);
    } catch (error) {
      logger.error(
        '[PRIVACY CONSENT] Failed to decode the saved consent cookie value',
        { error },
      );
    }
  }

  const validated = schema.safeParse(payload);

  if (!validated.success) {
    logger.error('[PRIVACY CONSENT] Invalid content in consent', {
      errors: validated.error.errors,
      payload,
    });
  }

  return validated.data;
};

export const setConsentState = async (
  input: Omit<z.output<typeof schema>, 'at' | 'shown'>,
) => {
  const store = await cookies();

  store.delete(ANALYTICS_CONSENT_COOKIE_NAME);
  store.delete(MARKETING_CONSENT_COOKIE_NAME);
  store.delete(COOKIE_CONSENT_SHOWN);

  const content: z.input<typeof schema> = {
    ...input,
    at: new Date(),
    shown: true,
  };

  const nextYear = new Date();
  // Set expiry to next year
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  store.set(NEW_COOKIE_NAME, JSON.stringify(content), {
    expires: nextYear,
    secure: true,
  });
};
