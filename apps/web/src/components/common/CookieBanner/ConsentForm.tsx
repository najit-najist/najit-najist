'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { updatePrivacyPolicySettingsActionInputSchema } from '@schemas/updatePrivacyPolicySettingsActionInputSchema';
import { type FC, useActionState } from 'react';

import { Button } from '../Button';
import { Checkbox } from '../form/Checkbox';
import { CheckboxWrapper } from '../form/CheckboxWrapper';
import { consentFormAction } from './consentFormAction';
import { useCookieBannerVisibility } from './cookieBannerVisibilityStore';

export interface ConsentFormFormState {
  analytics: boolean;
  marketing: boolean;
}

export type ConsentFormProps = {
  initialValues?: ConsentFormFormState;
};

export const ConsentForm: FC<ConsentFormProps> = ({ initialValues }) => {
  const { toggle } = useCookieBannerVisibility();
  const [lastResult, action] = useActionState(consentFormAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    defaultValue: initialValues,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: updatePrivacyPolicySettingsActionInputSchema,
      });
    },
    onSubmit() {
      toggle(false);
    },
  });

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-5 mt-8">
        <CheckboxWrapper
          childId="functional-cookies"
          title="Funkcionální cookies"
        >
          <Checkbox id="functional-cookies" disabled checked />
        </CheckboxWrapper>

        <div className="h-4 w-[2px] bg-gray-100 mx-2 hidden md:block" />
        <CheckboxWrapper childId="analytics-cookies" title="Analytické cookies">
          <Checkbox
            id="analytics-cookies"
            name={fields.analytics.name}
            defaultChecked={fields.analytics?.initialValue === 'on'}
          />
        </CheckboxWrapper>
        <div className="h-4 w-[2px] bg-gray-100 mx-2 hidden md:block" />
        <CheckboxWrapper
          childId="marketing-cookies"
          title="Marketingové cookies"
        >
          <Checkbox
            id="marketing-cookies"
            name={fields.marketing.name}
            defaultChecked={fields.marketing.initialValue === 'on'}
          />
        </CheckboxWrapper>
      </div>

      {form.errors}

      <Button className="mt-7 cursor-pointer" type="submit">
        Potvrdit
      </Button>
    </form>
  );
};
