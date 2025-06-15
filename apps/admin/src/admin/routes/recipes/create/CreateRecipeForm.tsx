import { zodResolver } from '@hookform/resolvers/zod';
import {
  ApplicationMethodAllocationValues,
  ApplicationMethodTargetTypeValues,
  ApplicationMethodTypeValues,
  PromotionStatusValues,
  PromotionTypeValues,
} from '@medusajs/types';
import {
  Alert,
  Badge,
  Button,
  clx,
  CurrencyInput,
  Divider,
  Heading,
  Input,
  ProgressStatus,
  ProgressTabs,
  RadioGroup,
  Text,
  toast,
} from '@medusajs/ui';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Form } from '../../../components/Form';
import { KeyboundForm } from '../../../components/KeyboundForm';
import { DeprecatedPercentageInput } from '../../../components/PercentageInput';
import { RouteFocusModal } from '../../../components/RouteFocusModal';
import { getCurrencySymbol } from '../../../utils/getCurrencySymbol';
import { Tab } from './constants';
import { CreatePromotionSchema } from './form-schema';
import { templates } from './templates';

const defaultValues = {
  campaign_id: undefined,
  template_id: templates[0].id!,
  campaign_choice: 'none' as 'none',
  is_automatic: 'false',
  code: '',
  type: 'standard' as PromotionTypeValues,
  status: 'draft' as PromotionStatusValues,
  rules: [],
  application_method: {
    allocation: 'each' as ApplicationMethodAllocationValues,
    type: 'fixed' as ApplicationMethodTypeValues,
    target_type: 'items' as ApplicationMethodTargetTypeValues,
    max_quantity: 1,
    target_rules: [],
    buy_rules: [],
  },
  campaign: undefined,
};

type TabState = Record<Tab, ProgressStatus>;

export const CreateRecipeForm = () => {
  const [tab, setTab] = useState<Tab>(Tab.DEFAULT);
  const [tabState, setTabState] = useState<TabState>({
    [Tab.DEFAULT]: 'in-progress',
    [Tab.SUROVINY]: 'not-started',
    [Tab.POSTUP]: 'not-started',
  });

  const { t } = useTranslation();

  const form = useForm<z.infer<typeof CreatePromotionSchema>>({
    defaultValues,
    resolver: zodResolver(CreatePromotionSchema),
  });
  const { setValue, reset, getValues } = form;

  const handleSubmit = form.handleSubmit(
    async (data) => {
      const {
        campaign_choice: _campaignChoice,
        is_automatic,
        template_id: _templateId,
        application_method,
        rules,
        ...promotionData
      } = data;
    },
    async (error) => {
      const { campaign: _campaign, ...rest } = error || {};
      const errorInPromotionTab = !!Object.keys(rest || {}).length;

      if (errorInPromotionTab) {
        toast.error(t('promotions.errors.promotionTabError'));
      }
    },
  );

  const handleTabChange = async (tab: Tab) => {
    switch (tab) {
      case Tab.DEFAULT:
        setTabState((prev) => ({
          ...prev,
          [Tab.DEFAULT]: 'in-progress',
        }));
        setTab(tab);
        break;
      case Tab.SUROVINY:
        setTabState((prev) => ({
          ...prev,
          [Tab.DEFAULT]: 'completed',
          [Tab.SUROVINY]: 'in-progress',
        }));
        setTab(tab);
        break;
      case Tab.POSTUP: {
        const valid = await form.trigger();

        if (!valid) {
          // If the promotion tab is not valid, we want to set the tab state to in-progress
          // and set the tab to the promotion tab
          setTabState({
            [Tab.DEFAULT]: 'completed',
            [Tab.SUROVINY]: 'in-progress',
            [Tab.POSTUP]: 'not-started',
          });
          setTab(Tab.SUROVINY);
          break;
        }

        setTabState((prev) => ({
          ...prev,
          [Tab.SUROVINY]: 'completed',
          [Tab.POSTUP]: 'in-progress',
        }));
        setTab(tab);
        break;
      }
    }
  };

  const handleContinue = async () => {
    switch (tab) {
      case Tab.DEFAULT:
        handleTabChange(Tab.SUROVINY);
        break;
      case Tab.SUROVINY: {
        const valid = await form.trigger();

        if (valid) {
          handleTabChange(Tab.DEFAULT);
        }

        break;
      }
      case Tab.POSTUP:
        const valid = await form.trigger();

        if (valid) {
          handleTabChange(Tab.DEFAULT);
        }

        break;
    }
  };

  const watchTemplateId = useWatch({
    control: form.control,
    name: 'template_id',
  });

  const currentTemplate = useMemo(() => {
    const currentTemplate = templates.find(
      (template) => template.id === watchTemplateId,
    );

    if (!currentTemplate) {
      return;
    }

    reset({ ...defaultValues, template_id: watchTemplateId });

    for (const [key, value] of Object.entries(currentTemplate.defaults)) {
      if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          setValue(`application_method.${subKey}`, subValue);
        }
      } else {
        setValue(key, value);
      }
    }

    return currentTemplate;
  }, [watchTemplateId, setValue, reset]);

  const watchValueType = useWatch({
    control: form.control,
    name: 'application_method.type',
  });

  const isFixedValueType = watchValueType === 'fixed';
  const watchAllocation = useWatch({
    control: form.control,
    name: 'application_method.allocation',
  });

  useEffect(() => {
    if (watchAllocation === 'across') {
      setValue('application_method.max_quantity', null);
    }
  }, [watchAllocation, setValue]);

  const watchType = useWatch({
    control: form.control,
    name: 'type',
  });

  const isTypeStandard = watchType === 'standard';

  const watchCampaignChoice = useWatch({
    control: form.control,
    name: 'campaign_choice',
  });

  useEffect(() => {
    if (watchCampaignChoice !== 'existing') {
      setValue('campaign_id', undefined);
    }

    if (watchCampaignChoice !== 'new') {
      setValue('campaign', undefined);
    }
  }, [watchCampaignChoice, getValues, setValue]);

  const watchRules = useWatch({
    control: form.control,
    name: 'rules',
  });

  const watchCurrencyRule = watchRules.find(
    (rule) => rule.attribute === 'currency_code',
  );

  if (watchCurrencyRule) {
    const formData = form.getValues();
    const currencyCode = formData.application_method.currency_code;
    const ruleValue = watchCurrencyRule.values;

    if (!Array.isArray(ruleValue) && currencyCode !== ruleValue) {
      form.setValue('application_method.currency_code', ruleValue as string);
    }
  }

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm className="flex h-full flex-col" onSubmit={handleSubmit}>
        <ProgressTabs
          value={tab}
          onValueChange={(tab) => handleTabChange(tab as Tab)}
          className="flex h-full flex-col overflow-hidden"
        >
          <RouteFocusModal.Header>
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="-my-2 w-full max-w-[600px] border-l">
                <ProgressTabs.List className="grid w-full grid-cols-3">
                  <ProgressTabs.Trigger
                    className="w-full"
                    value={Tab.DEFAULT}
                    status={tabState[Tab.DEFAULT]}
                  >
                    Hlavní informace
                  </ProgressTabs.Trigger>

                  <ProgressTabs.Trigger
                    className="w-full"
                    value={Tab.SUROVINY}
                    status={tabState[Tab.SUROVINY]}
                  >
                    Suroviny
                  </ProgressTabs.Trigger>

                  <ProgressTabs.Trigger
                    className="w-full"
                    value={Tab.POSTUP}
                    status={tabState[Tab.POSTUP]}
                  >
                    Postup
                  </ProgressTabs.Trigger>
                </ProgressTabs.List>
              </div>
            </div>
          </RouteFocusModal.Header>

          <RouteFocusModal.Body className="size-full overflow-hidden">
            <ProgressTabs.Content
              value={Tab.DEFAULT}
              className="size-full overflow-y-auto"
            >
              <div className="flex size-full flex-col items-center">
                <div className="w-full max-w-[720px] py-16">
                  <Form.Field
                    control={form.control}
                    name="template_id"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>{t('promotions.fields.type')}</Form.Label>

                          <Form.Control>
                            <RadioGroup
                              key={'template_id'}
                              className="flex-col gap-y-3"
                              {...field}
                              onValueChange={field.onChange}
                            >
                              {templates.map((template) => {
                                return (
                                  <RadioGroup.ChoiceBox
                                    key={template.id}
                                    value={template.id}
                                    label={template.title}
                                    description={template.description}
                                  />
                                );
                              })}
                            </RadioGroup>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      );
                    }}
                  />
                </div>
              </div>
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={Tab.SUROVINY}
              className="size-full overflow-y-auto"
            >
              <div className="flex size-full flex-col items-center">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8 py-16">
                  <Heading level="h1" className="text-fg-base">
                    {t(`promotions.sections.details`)}

                    {currentTemplate?.title && (
                      <Badge
                        className="ml-2 align-middle"
                        color="grey"
                        size="2xsmall"
                        rounded="full"
                      >
                        {currentTemplate?.title}
                      </Badge>
                    )}
                  </Heading>

                  {form.formState.errors.root && (
                    <Alert
                      variant="error"
                      dismissible={false}
                      className="text-balance"
                    >
                      {form.formState.errors.root.message}
                    </Alert>
                  )}

                  <Form.Field
                    control={form.control}
                    name="is_automatic"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t('promotions.form.method.label')}
                          </Form.Label>

                          <Form.Control>
                            <RadioGroup
                              className="flex gap-y-3"
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <RadioGroup.ChoiceBox
                                value={'false'}
                                label={t('promotions.form.method.code.title')}
                                description={t(
                                  'promotions.form.method.code.description',
                                )}
                                className={clx('basis-1/2')}
                              />

                              <RadioGroup.ChoiceBox
                                value={'true'}
                                label={t(
                                  'promotions.form.method.automatic.title',
                                )}
                                description={t(
                                  'promotions.form.method.automatic.description',
                                )}
                                className={clx('basis-1/2')}
                              />
                            </RadioGroup>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      );
                    }}
                  />

                  <Form.Field
                    control={form.control}
                    name="status"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            {t('promotions.form.status.label')}
                          </Form.Label>

                          <Form.Control>
                            <RadioGroup
                              className="flex gap-y-3"
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <RadioGroup.ChoiceBox
                                value={'draft'}
                                label={t('promotions.form.status.draft.title')}
                                description={t(
                                  'promotions.form.status.draft.description',
                                )}
                                className={clx('basis-1/2')}
                              />

                              <RadioGroup.ChoiceBox
                                value={'active'}
                                label={t('promotions.form.status.active.title')}
                                description={t(
                                  'promotions.form.status.active.description',
                                )}
                                className={clx('basis-1/2')}
                              />
                            </RadioGroup>
                          </Form.Control>
                          <Form.ErrorMessage />
                        </Form.Item>
                      );
                    }}
                  />

                  <div className="flex gap-y-4">
                    <Form.Field
                      control={form.control}
                      name="code"
                      render={({ field }) => {
                        return (
                          <Form.Item className="basis-1/2">
                            <Form.Label>
                              {t('promotions.form.code.title')}
                            </Form.Label>

                            <Form.Control>
                              <Input {...field} placeholder="SUMMER15" />
                            </Form.Control>

                            <Text
                              size="small"
                              leading="compact"
                              className="text-ui-fg-subtle"
                            >
                              <Trans
                                t={t}
                                i18nKey="promotions.form.code.description"
                                components={[<br key="break" />]}
                              />
                            </Text>
                          </Form.Item>
                        );
                      }}
                    />
                  </div>

                  {!currentTemplate?.hiddenFields?.includes('type') && (
                    <Form.Field
                      control={form.control}
                      name="type"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label>
                              {t('promotions.fields.type')}
                            </Form.Label>
                            <Form.Control>
                              <RadioGroup
                                className="flex gap-y-3"
                                {...field}
                                onValueChange={field.onChange}
                              >
                                <RadioGroup.ChoiceBox
                                  value={'standard'}
                                  label={t(
                                    'promotions.form.type.standard.title',
                                  )}
                                  description={t(
                                    'promotions.form.type.standard.description',
                                  )}
                                  className={clx('basis-1/2')}
                                />

                                <RadioGroup.ChoiceBox
                                  value={'buyget'}
                                  label={t('promotions.form.type.buyget.title')}
                                  description={t(
                                    'promotions.form.type.buyget.description',
                                  )}
                                  className={clx('basis-1/2')}
                                />
                              </RadioGroup>
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        );
                      }}
                    />
                  )}

                  <Divider />

                  {!currentTemplate?.hiddenFields?.includes(
                    'application_method.type',
                  ) && (
                    <Form.Field
                      control={form.control}
                      name="application_method.type"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label>
                              {t('promotions.fields.value_type')}
                            </Form.Label>
                            <Form.Control>
                              <RadioGroup
                                className="flex gap-y-3"
                                {...field}
                                onValueChange={field.onChange}
                              >
                                <RadioGroup.ChoiceBox
                                  value={'fixed'}
                                  label={t(
                                    'promotions.form.value_type.fixed.title',
                                  )}
                                  description={t(
                                    'promotions.form.value_type.fixed.description',
                                  )}
                                  className={clx('basis-1/2')}
                                />

                                <RadioGroup.ChoiceBox
                                  value={'percentage'}
                                  label={t(
                                    'promotions.form.value_type.percentage.title',
                                  )}
                                  description={t(
                                    'promotions.form.value_type.percentage.description',
                                  )}
                                  className={clx('basis-1/2')}
                                />
                              </RadioGroup>
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Form.Item>
                        );
                      }}
                    />
                  )}

                  <div className="flex gap-x-2 gap-y-4">
                    {!currentTemplate?.hiddenFields?.includes(
                      'application_method.value',
                    ) && (
                      <Form.Field
                        control={form.control}
                        name="application_method.value"
                        render={({ field: { onChange, value, ...field } }) => {
                          const currencyCode =
                            form.getValues().application_method.currency_code;

                          return (
                            <Form.Item className="basis-1/2">
                              <Form.Label
                                tooltip={
                                  currencyCode || !isFixedValueType
                                    ? undefined
                                    : t('promotions.fields.amount.tooltip')
                                }
                              >
                                {t('promotions.form.value.title')}
                              </Form.Label>

                              <Form.Control>
                                {isFixedValueType ? (
                                  <CurrencyInput
                                    {...field}
                                    min={0}
                                    onValueChange={(value) => {
                                      onChange(value ? parseInt(value) : '');
                                    }}
                                    code={currencyCode || 'USD'}
                                    symbol={
                                      currencyCode
                                        ? getCurrencySymbol(currencyCode)
                                        : '$'
                                    }
                                    value={value}
                                    disabled={!currencyCode}
                                  />
                                ) : (
                                  <DeprecatedPercentageInput
                                    key="amount"
                                    className="text-right"
                                    min={0}
                                    max={100}
                                    {...field}
                                    value={value}
                                    onChange={(e) => {
                                      onChange(
                                        e.target.value === ''
                                          ? null
                                          : parseInt(e.target.value),
                                      );
                                    }}
                                  />
                                )}
                              </Form.Control>
                              <Text
                                size="small"
                                leading="compact"
                                className="text-ui-fg-subtle"
                              >
                                <Trans
                                  t={t}
                                  i18nKey={
                                    isFixedValueType
                                      ? 'promotions.form.value_type.fixed.description'
                                      : 'promotions.form.value_type.percentage.description'
                                  }
                                  components={[<br key="break" />]}
                                />
                              </Text>
                              <Form.ErrorMessage />
                            </Form.Item>
                          );
                        }}
                      />
                    )}

                    {isTypeStandard && watchAllocation === 'each' && (
                      <Form.Field
                        control={form.control}
                        name="application_method.max_quantity"
                        render={({ field }) => {
                          return (
                            <Form.Item className="basis-1/2">
                              <Form.Label>
                                {t('promotions.form.max_quantity.title')}
                              </Form.Label>

                              <Form.Control>
                                <Input
                                  {...form.register(
                                    'application_method.max_quantity',
                                    { valueAsNumber: true },
                                  )}
                                  type="number"
                                  min={1}
                                  placeholder="3"
                                />
                              </Form.Control>

                              <Text
                                size="small"
                                leading="compact"
                                className="text-ui-fg-subtle"
                              >
                                <Trans
                                  t={t}
                                  i18nKey="promotions.form.max_quantity.description"
                                  components={[<br key="break" />]}
                                />
                              </Text>
                            </Form.Item>
                          );
                        }}
                      />
                    )}
                  </div>

                  {isTypeStandard &&
                    !currentTemplate?.hiddenFields?.includes(
                      'application_method.allocation',
                    ) && (
                      <Form.Field
                        control={form.control}
                        name="application_method.allocation"
                        render={({ field }) => {
                          return (
                            <Form.Item>
                              <Form.Label>
                                {t('promotions.fields.allocation')}
                              </Form.Label>

                              <Form.Control>
                                <RadioGroup
                                  className="flex gap-y-3"
                                  {...field}
                                  onValueChange={field.onChange}
                                >
                                  <RadioGroup.ChoiceBox
                                    value={'each'}
                                    label={t(
                                      'promotions.form.allocation.each.title',
                                    )}
                                    description={t(
                                      'promotions.form.allocation.each.description',
                                    )}
                                    className={clx('basis-1/2')}
                                  />

                                  <RadioGroup.ChoiceBox
                                    value={'across'}
                                    label={t(
                                      'promotions.form.allocation.across.title',
                                    )}
                                    description={t(
                                      'promotions.form.allocation.across.description',
                                    )}
                                    className={clx('basis-1/2')}
                                  />
                                </RadioGroup>
                              </Form.Control>
                              <Form.ErrorMessage />
                            </Form.Item>
                          );
                        }}
                      />
                    )}
                </div>
              </div>
            </ProgressTabs.Content>

            <ProgressTabs.Content
              value={Tab.POSTUP}
              className="size-full overflow-auto"
            >
              <div className="flex flex-col items-center">
                <div className="flex w-full max-w-[720px] flex-col gap-y-8 py-16"></div>
              </div>
            </ProgressTabs.Content>
          </RouteFocusModal.Body>
        </ProgressTabs>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t('actions.cancel')}
              </Button>
            </RouteFocusModal.Close>

            {tab === Tab.POSTUP ? (
              <Button
                key="save-btn"
                type="submit"
                size="small"
                isLoading={false}
              >
                {t('actions.save')}
              </Button>
            ) : (
              <Button
                key="continue-btn"
                type="button"
                onClick={handleContinue}
                size="small"
              >
                {t('actions.continue')}
              </Button>
            )}
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  );
};
