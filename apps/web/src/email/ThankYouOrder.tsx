import { Alert } from '@components/common/Alert';
import { Badge } from '@components/common/Badge';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { Price } from '@components/common/Price';
import { DEFAULT_DATE_FORMAT } from '@constants';
import { dayjs } from '@dayjs';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { OrderPickupTime, products } from '@najit-najist/database/models';
import {
  Column,
  Img,
  Row,
  Button,
  Link,
  Section,
  Hr,
} from '@react-email/components';
import { orderGetTotalPrice } from '@utils/orderGetTotalPrice';
import { cx } from 'class-variance-authority';
import { FC, PropsWithChildren } from 'react';

import { CenteredRow } from './_components/CenteredRow';
import { ColoredSection } from './_components/ColoredSection';
import { Heading } from './_components/Heading';
import { Layout } from './_components/Layout';
import { Spacing } from './_components/Spacing';
import { Text } from './_components/Text';
import { testOrder } from './constants';
import { getFileUrl } from './getFileUrl';
import { OrderWithRelations } from './types';

export interface ThankYouOrderProps {
  needsPayment: boolean;
  siteOrigin: string;
  order: OrderWithRelations & {
    pickupDate: OrderPickupTime | null;
  };
  orderLink: string;
}

const ItemListItem: FC<
  PropsWithChildren<{ className?: string; skipSpacing?: boolean }>
> = ({ children, className, skipSpacing }) => {
  return (
    <Section className={className}>
      {skipSpacing ? null : <Spacing size="md" />}
      <Row>{children}</Row>
    </Section>
  );
};

const OrderProduct: FC<{
  data: ThankYouOrderProps['order']['orderedProducts'][number];
  siteOrigin: string;
}> = ({ data, siteOrigin }) => {
  const productImage = data.product.images[0];
  const imageSize = 50;

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
                siteOrigin,
              ).toString()}
              width={imageSize}
              height={imageSize}
              alt="Obrázek produktu"
              className="rounded-project-input"
            />
          ) : (
            <Section
              style={{ height: imageSize, width: imageSize }}
              className="bg-gray-100 border-gray-200 border border-solid rounded-project"
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
        <Badge size="small" color="green">
          {data.product.category?.name ?? 'Neznámá kategorie'}
        </Badge>
        <br />
        <Link
          className="underline mt-2 block"
          href={`https://najinajist.cz/produkty/${encodeURIComponent(
            data.product.slug,
          )}`}
        >
          {data.count}x {data.product.name}
        </Link>
      </Column>
      <Column className="w-4" />
      <Column className="text-right whitespace-nowrap text-gray-400">
        <Section>
          <Row>
            {data.discount ? (
              <Column>
                <s>
                  <Price
                    key="discount"
                    size="xs"
                    className="mr-5 line-through"
                    value={data.totalPrice}
                  />
                </s>
              </Column>
            ) : null}
            <Column>
              <Price
                key="totalPrice"
                size="sm"
                value={data.totalPrice - data.discount}
              />
            </Column>
          </Row>
        </Section>
      </Column>
    </ItemListItem>
  );
};

export default function ThankYouOrder({
  order = testOrder,
  needsPayment = false,
  siteOrigin = 'https://najitnajist.cz',
  orderLink = 'test',
}: ThankYouOrderProps) {
  const title = `Objednávka #${order.id} na najitnajist.cz`;

  const hasInvoiceAddress = !!order.invoiceAddress;
  const icoAndDic = order.ico ? (
    <>
      <Text className="hover:underline !mt-0 !mb-0" spacing={false}>
        <span className="mr-2 -mt-0.5">IČO</span> {order.ico}
      </Text>
      {order.dic ? (
        <Text className="hover:underline  !mt-0 !mb-0" spacing={false}>
          <span className="mr-2 -mt-0.5">DIČ</span> {order.dic}
        </Text>
      ) : null}
    </>
  ) : null;

  const shippingAndInvoiceInformationSection = (
    <>
      <Section>
        <CenteredRow>
          <Heading as="h3">
            {hasInvoiceAddress
              ? 'Doručovací informace'
              : 'Doručovací a fakturační informace'}
          </Heading>
          <Row className={hasInvoiceAddress ? '' : 'mb-5'}>
            <Column className="text-gray-700 content-start">
              <address className="not-italic mt-5">
                <span className="block">
                  {order.firstName} {order.lastName}
                </span>
                <span className="block">
                  {order.address?.streetName?.trim()},{' '}
                  {order.address?.houseNumber}
                </span>
                <span className="block">
                  {order.address?.city} {order.address?.postalCode}
                </span>
              </address>
            </Column>
            <Column>
              <Text className="hover:underline !mb-0" spacing={false}>
                <EnvelopeIcon className="w-3 h-3 inline-block mr-2 -mt-0.5" />{' '}
                {order.email}
              </Text>
              {order.telephone ? (
                <Text
                  className={cx(
                    'hover:underline !mt-0',
                    icoAndDic && !hasInvoiceAddress ? '!mb-0' : '',
                  )}
                  spacing={false}
                >
                  <PhoneIcon className="w-3 h-3 inline-block mr-2 -mt-0.5" /> +
                  {order.telephone?.code} {order.telephone?.telephone}
                </Text>
              ) : null}
              {hasInvoiceAddress ? null : icoAndDic}
            </Column>
          </Row>
        </CenteredRow>
      </Section>

      {hasInvoiceAddress ? (
        <Section>
          <CenteredRow>
            <Heading as="h3">Fakturační informace</Heading>
            <Row className="mb-5">
              <Column className="text-gray-700 content-start">
                <address className="not-italic mt-5">
                  <span className="block">
                    {order.firstName} {order.lastName}
                  </span>
                  <span className="block">
                    {order.invoiceAddress?.streetName?.trim()},{' '}
                    {order.invoiceAddress?.houseNumber}
                  </span>
                  <span className="block">
                    {order.invoiceAddress?.city}{' '}
                    {order.invoiceAddress?.postalCode}
                  </span>
                </address>
              </Column>
              <Column>
                <Text className="hover:underline !mb-0" spacing={false}>
                  <EnvelopeIcon className="w-3 h-3 inline-block mr-2 -mt-0.5" />{' '}
                  {order.email}
                </Text>
                <Text
                  className={cx(
                    'hover:underline !mt-0',
                    icoAndDic ? '!mb-0' : '',
                  )}
                  spacing={false}
                >
                  <PhoneIcon className="w-3 h-3 inline-block mr-2 -mt-0.5" /> +
                  {order.telephone?.code} {order.telephone?.telephone}
                </Text>
                {icoAndDic}
              </Column>
            </Row>
          </CenteredRow>
        </Section>
      ) : null}
    </>
  );

  const shippingMethodInformation = (
    <Section>
      <CenteredRow>
        <Row className="table-fixed">
          <Column>
            <Heading as="h3" className="mt-0">
              Doručovací Metoda
            </Heading>
          </Column>
          <Column>
            <Badge size="lg" color="green" className="mt-1">
              {order.deliveryMethod.name}
            </Badge>
          </Column>
        </Row>
        <Row>
          <Column>
            {order.deliveryMethod ? (
              <Section>
                {order.pickupDate ? (
                  <Row>
                    <Column>
                      <Text>
                        {' '}
                        v{' '}
                        <strong>
                          {dayjs
                            .tz(order.pickupDate.date)
                            .format(DEFAULT_DATE_FORMAT)}
                        </strong>
                      </Text>
                    </Column>
                  </Row>
                ) : null}
                <Row>
                  <Text className="mt-1">
                    {order.deliveryMethod.description}
                  </Text>
                </Row>
              </Section>
            ) : (
              <Text>Neznámá doručovací metoda</Text>
            )}
          </Column>
        </Row>

        {order.deliveryMethod.notes ? (
          <Row>
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
          </Row>
        ) : null}
      </CenteredRow>
    </Section>
  );

  const paymentMethodSection = (
    <Section>
      <CenteredRow>
        <Row className="table-fixed">
          <Column>
            <Heading as="h3" className="mt-0">
              Platební metoda
            </Heading>
          </Column>
          <Column>
            <Badge size="lg" color="green" className="mt-1">
              {order.paymentMethod.name}
            </Badge>
          </Column>
        </Row>

        {order.state === 'unpaid' && order.paymentMethod?.notes ? (
          <Row>
            <Alert
              color="warning"
              heading={
                <>
                  <ExclamationTriangleIcon className="w-4 h-4 inline" />{' '}
                  Důležitá informace
                </>
              }
              className="mt-3"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: order.paymentMethod.notes,
                }}
              ></div>
            </Alert>
          </Row>
        ) : null}
      </CenteredRow>
    </Section>
  );

  const descriptionSection = (
    <Section>
      <CenteredRow>
        <Heading as="h3">Poznámky k obejdnávce</Heading>
        <Row>
          <Text className="text-gray-700">
            {order.notes || 'Žádná poznámka'}
          </Text>
        </Row>
      </CenteredRow>
    </Section>
  );

  return (
    <Layout siteOrigin={siteOrigin} title={title}>
      <Section>
        <CenteredRow>
          <Heading as="h2">Děkujeme za objednávku 🎉</Heading>
        </CenteredRow>
        <CenteredRow>
          <Text spacing={false}>
            Děkujeme za vytvoření objednávky s referenčním číslem{' '}
            <Link href={orderLink}>#{order.id}</Link>!
          </Text>
        </CenteredRow>
        <CenteredRow>
          <Text spacing={false} style={{ margin: 0 }}>
            O dalších krocích vás budeme zanedlouho informovat. <br /> Mezitím
            si můžete Vaši objednávku sledovat na stránkách{' '}
            <Link href={siteOrigin}>najitnajist.cz</Link>.
          </Text>
        </CenteredRow>
        <Spacing size="lg" />

        <CenteredRow>
          <Section>
            <Column>
              <Text>
                <span className="text-gray-900">
                  Referenční číslo objednávky
                </span>
                <br />
                <span className="mt-2 text-project-primary text-lg">
                  #{order.id}
                </span>
              </Text>
            </Column>
            <Column>
              <Text>
                <span className="text-gray-900">Datum a čas objednávky</span>
                <br />
                <span className="mt-2 text-project-primary text-lg">
                  {dayjs.tz(order.createdAt).format(DEFAULT_DATE_FORMAT)}
                </span>
              </Text>
            </Column>
          </Section>
        </CenteredRow>

        <Spacing size="lg" />

        <CenteredRow>
          <Button
            className={buttonStyles({
              className: '!inline-block',
              size: 'lg',
            })}
            href={orderLink}
          >
            <InformationCircleIcon className="w-5 mr-2 -mb-1" strokeWidth={2} />
            Zobrazit objednávku
          </Button>
        </CenteredRow>
        <Spacing size="lg" />
      </Section>

      {shippingAndInvoiceInformationSection}
      {shippingMethodInformation}
      {paymentMethodSection}
      {descriptionSection}

      <Spacing size="lg" />

      <ColoredSection>
        <CenteredRow>
          {order.orderedProducts.map((product: any) => (
            <OrderProduct
              key={product.id}
              siteOrigin={siteOrigin}
              data={product}
            />
          ))}
          {/* footer */}
          <Hr className="!border-none bg-gray-100 w-full mt-5 h-[1px] mb-0" />
          <ItemListItem key="subtotal" className="text-gray-700">
            <Column>Mezisoučet</Column>
            <Column className="text-right">
              <Price size={'sm'} value={order.subtotal} />
            </Column>
          </ItemListItem>

          {order.discount ? (
            <ItemListItem key="discount" className="text-gray-700">
              <Column>
                Sleva
                <Badge color="blue" size="small" className="ml-2">
                  {order.couponPatch?.coupon.name}
                </Badge>
              </Column>
              <Column className="text-right">
                <Price size={'sm'} value={order.discount * -1} />
              </Column>
            </ItemListItem>
          ) : null}

          <ItemListItem key="deliveryMethodPrice" className="text-gray-700">
            <Column>{order.deliveryMethod.name}</Column>
            <Column className="text-right">
              <Price size={'sm'} value={order.deliveryMethodPrice ?? 0} />
            </Column>
          </ItemListItem>

          <ItemListItem
            key="payment-method"
            skipSpacing
            className="text-gray-700"
          >
            <Column>{order.paymentMethod.name}</Column>
            <Column className="text-right">
              <Price size={'sm'} value={order.paymentMethodPrice ?? 0} />
            </Column>
          </ItemListItem>
          <Hr className="!border-none bg-gray-100 w-full mt-5 h-[1px] mb-0" />
          <ItemListItem>
            <Column className="font-semibold">Celkově</Column>
            <Column className="text-right font-semibold">
              <Price size={'sm'} value={orderGetTotalPrice(order)} />
            </Column>
          </ItemListItem>
          <Spacing size="md" />
        </CenteredRow>
        <Spacing size="lg" />
      </ColoredSection>
    </Layout>
  );
}

ThankYouOrder.PreviewProps = {
  siteOrigin: 'http://localhost:3000',
  order: testOrder,
  orderLink: 'http://localhost:3000/test',
  needsPayment: false,
} satisfies ThankYouOrderProps;
