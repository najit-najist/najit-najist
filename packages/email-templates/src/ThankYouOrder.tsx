import { InformationCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { products } from '@najit-najist/database/models';
import { buttonStyles, Alert, Price } from '@najit-najist/ui';
import {
  Column,
  Img,
  Row,
  Button,
  Link,
  Section,
} from '@react-email/components';
import { FC, PropsWithChildren } from 'react';

import { CenteredRow } from './_components/CenteredRow';
import { ColoredSection } from './_components/ColoredSection';
import { Heading } from './_components/Heading';
import { Layout } from './_components/Layout';
import { PaperCenteredRow } from './_components/PaperCenteredRow';
import { PaperColumn } from './_components/PaperColumn';
import { Spacing } from './_components/Spacing';
import { Text } from './_components/Text';
import { testOrder } from './constants';
import { dayjs } from './day';
import { getFileUrl } from './getFileUrl';
import { OrderWithRelations } from './types';

export interface ThankYouOrderProps {
  needsPayment: boolean;
  siteOrigin: string;
  order: OrderWithRelations;
  orderLink: string;
}

const ItemListItem: FC<
  PropsWithChildren<{ className?: string; skipSpacing?: boolean }>
> = ({ children, className, skipSpacing }) => {
  return (
    <Section className={className}>
      {skipSpacing ? null : <Spacing size="md" />}
      <Row>
        <Column className="w-4" />
        {children}
        <Column className="w-3" />
      </Row>
    </Section>
  );
};

const OrderProduct: FC<{
  data: ThankYouOrderProps['order']['orderedProducts'][number];
  siteOrigin: string;
}> = ({ data, siteOrigin }) => {
  const productImage = data.product.images[0];
  const imageSize = 40;
  return (
    <ItemListItem>
      <Column style={{ width: imageSize }}>
        <div>
          {productImage ? (
            <Img
              src={new URL(
                getFileUrl(products, data.product.id, productImage, {
                  height: imageSize,
                  width: imageSize,
                }),
                siteOrigin
              ).toString()}
              width={imageSize}
              height={imageSize}
              alt="Obrázek produktu"
              className="rounded-lg"
            />
          ) : (
            <Section
              style={{ height: imageSize, width: imageSize }}
              className="bg-gray-100 border-gray-200 border border-solid rounded-lg"
            >
              <Row>
                <Column className="text-center">
                  <PhotoIcon className="w-2/4" />
                </Column>
              </Row>
            </Section>
          )}
        </div>
      </Column>
      <Column className="w-4" />
      <Column>
        <Link
          className="underline"
          href={`https://najinajist.cz/produkty/${encodeURIComponent(
            data.product.slug
          )}`}
        >
          {data.count}x {data.product.name}
        </Link>
      </Column>
      <Column className="w-4" />
      <Column className="text-right whitespace-nowrap text-gray-400">
        <Price size={'sm'} value={data.totalPrice} />
      </Column>
    </ItemListItem>
  );
};

export default function ThankYouOrder({
  order = testOrder,
  needsPayment = false,
  siteOrigin,
  orderLink = 'test',
}: ThankYouOrderProps) {
  const title = `Objednávka #${order.id} na najitnajist.cz`;

  const orderInformationSection = (
    <>
      <CenteredRow>
        <Section>
          <Row>
            <Column className="align-super">
              <Heading as="h3">Obecné informace</Heading>
              <Section>
                <Row>
                  <PaperColumn>
                    <Section className="not-italic p-3 text-sm text-gray-700">
                      <Row>
                        <Column className="text-sm">Číslo objednávky:</Column>
                        <Column className="text-right">
                          <Link href={orderLink}>#{order.id}</Link>
                        </Column>
                      </Row>
                      <Spacing size="sm" />
                      <Row>
                        <Column>Datum objednávky:</Column>
                        <Column className="text-right">
                          {dayjs
                            .tz(order.createdAt)
                            .format('DD. MM. YYYY v HH:mm')}
                        </Column>
                      </Row>
                      <Spacing size="sm" />
                      <Row>
                        <Column>Typ dopravy:</Column>
                        <Column className="text-right">
                          {order.deliveryMethod.name}
                        </Column>
                      </Row>
                      <Spacing size="sm" />
                      <Row>
                        <Column>Typ platby:</Column>
                        <Column className="text-right">
                          {order.paymentMethod.name}
                        </Column>
                      </Row>
                      <Spacing size="sm" />
                      <Row className="text-project-secondary">
                        <Column>Cena celkem:</Column>
                        <Column className="text-right">
                          <Price
                            size={'sm'}
                            value={
                              order.subtotal +
                              (order.paymentMethodPrice ?? 0) +
                              (order.deliveryMethodPrice ?? 0)
                            }
                          />
                        </Column>
                      </Row>
                    </Section>
                  </PaperColumn>
                </Row>
              </Section>
            </Column>
          </Row>
          <Row>
            <Column className="align-super">
              <Heading as="h3">Adresa</Heading>
              <Section>
                <Row>
                  <PaperColumn>
                    <address className="not-italic p-3 text-sm text-gray-700">
                      <span className="block">
                        {order.firstName} {order.lastName}
                      </span>
                      <span className="block mt-2">
                        {order.address.streetName}, {order.address.houseNumber}
                      </span>
                      <span className="block">
                        {order.address.city} {order.address.postalCode}
                      </span>
                    </address>
                  </PaperColumn>
                </Row>
              </Section>
            </Column>
          </Row>
        </Section>
      </CenteredRow>
    </>
  );

  const itemsSection = (
    <>
      <CenteredRow>
        <Heading as="h3">Položky</Heading>
      </CenteredRow>
      <PaperCenteredRow className="pt-5">
        {order.orderedProducts.map((product: any) => (
          <OrderProduct
            key={product.id}
            siteOrigin={siteOrigin}
            data={product}
          />
        ))}
        {/* footer */}
        <hr className="border-none bg-gray-200 w-full mt-5 h-0.5 mb-0" />
        <ItemListItem className="text-gray-700">
          <Column>{order.deliveryMethod.name}</Column>
          <Column className="text-right">
            <Price size={'sm'} value={order.deliveryMethodPrice ?? 0} />
          </Column>
        </ItemListItem>
        {order.deliveryMethod.notes ? (
          <ItemListItem skipSpacing className="text-gray-700">
            <Column colSpan={2}>
              <Alert
                heading={
                  <>
                    <InformationCircleIcon className="w-4 inline -mb-1" />{' '}
                    Poznámky k dopravě
                  </>
                }
                color="warning"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: order.deliveryMethod.notes,
                  }}
                />
              </Alert>
            </Column>
          </ItemListItem>
        ) : null}
        <ItemListItem className="text-gray-700">
          <Column>{order.paymentMethod.name}</Column>
          <Column className="text-right">
            <Price size={'sm'} value={order.paymentMethodPrice ?? 0} />
          </Column>
        </ItemListItem>
        {order.paymentMethod.notes ? (
          <ItemListItem skipSpacing className="text-gray-700">
            <Column colSpan={2}>
              <Alert
                heading={
                  <>
                    <InformationCircleIcon className="w-4 inline -mb-1" />{' '}
                    Poznámky k platbě
                  </>
                }
                color="warning"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: order.paymentMethod.notes,
                  }}
                />
              </Alert>
            </Column>
          </ItemListItem>
        ) : null}
        <ItemListItem>
          <Column className="font-semibold">Celkově</Column>
          <Column className="text-right font-semibold">
            <Price
              size={'sm'}
              value={
                order.subtotal +
                (order.paymentMethodPrice ?? 0) +
                (order.deliveryMethodPrice ?? 0)
              }
            />
          </Column>
        </ItemListItem>
        <Spacing size="md" />
      </PaperCenteredRow>
    </>
  );

  return (
    <Layout siteOrigin={siteOrigin} title={title}>
      <Section>
        <Row>
          <Column>
            <Heading className="text-center" as="h2">
              Děkujeme za objednávku!
            </Heading>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text spacing={false} className="text-center">
              Děkujeme za vytvoření objednávky s referenčním číslem{' '}
              <Link href={orderLink}>#{order.id}</Link>!
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-center" spacing={false} style={{ margin: 0 }}>
              O dalších krocích vás budeme zanedlouho informovat. <br /> Mezitím
              si můžete Vaši objednávku sledovat na stránkách{' '}
              <Link href={siteOrigin}>najitnajist.cz</Link> ve vašem účtě.
            </Text>
          </Column>
        </Row>
      </Section>

      <Section>
        <Spacing size="lg" />
        <Row>
          <Column align="center">
            <Button
              className={buttonStyles({
                appearance: 'spaceless',
                className: 'px-5 py-4',
              })}
              href={orderLink}
            >
              <InformationCircleIcon
                className="w-5 mr-2 -mb-1"
                strokeWidth={2}
              />
              Zobrazit detail objednávky
            </Button>
          </Column>
        </Row>
        <Spacing size="lg" />
      </Section>

      <ColoredSection>
        {orderInformationSection}
        {itemsSection}
        <Spacing size="lg" />
      </ColoredSection>
    </Layout>
  );
}
