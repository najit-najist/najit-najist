import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, Input, Text, toast } from '@medusajs/ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  PostCreateProductBrand,
  postCreateProductBrandSchema,
} from '../../../../api/product_brands/validators';
import { Form } from '../../../components/Form';
import { KeyboundForm } from '../../../components/KeyboundForm';
import { RouteFocusModal } from '../../../components/RouteFocusModal';
import { useRouteModal } from '../../../components/RouteModalProvider';
import { useCreateProductBrand } from '../../../hooks/useCreateProductBrand';

export const CreateProductBrandForm = () => {
  const { handleSuccess } = useRouteModal();
  const { t } = useTranslation();

  const form = useForm<PostCreateProductBrand>({
    defaultValues: {
      name: '',
      url: '',
    },
    resolver: zodResolver(postCreateProductBrandSchema),
  });

  const { mutateAsync, isPending } = useCreateProductBrand();

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        url: null,
      },
      {
        onSuccess: ({ brand }) => {
          toast.success('Značka vytvořena');

          handleSuccess(`/product_brands/${brand.id}`);
        },
        onError: (e) => {
          toast.error(e.message);
        },
      },
    );
  });

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading className="capitalize">Vytvoření značky</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  Vytvořte produktovou značku pro produkty
                </Text>
              </div>
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>Jméno</Form.Label>
                      <Form.Control>
                        <Input size="small" autoComplete="company" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  );
                }}
              />
              {/* <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="address_1"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t('fields.address')}</Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="address_1"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="address_2"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t('fields.address2')}</Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="address_2"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>
                          {t('fields.postalCode')}
                        </Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="postal_code"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="city"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t('fields.city')}</Form.Label>
                        <Form.Control>
                          <Input size="small" autoComplete="city" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="country_code"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t('fields.country')}</Form.Label>
                        <Form.Control>
                          <CountrySelect
                            autoComplete="country_code"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="province"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t('fields.state')}</Form.Label>
                        <Form.Control>
                          <Input
                            size="small"
                            autoComplete="province"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="phone"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>{t('fields.phone')}</Form.Label>
                        <Form.Control>
                          <Input size="small" autoComplete="phone" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    );
                  }}
                />
              </div> */}
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t('actions.cancel')}
              </Button>
            </RouteFocusModal.Close>
            <Button type="submit" size="small" isLoading={isPending}>
              {t('actions.save')}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  );
};
