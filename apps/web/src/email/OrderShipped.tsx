import { buttonStyles } from '@components/common/Button/buttonStyles';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button, Column, Row, Section } from '@react-email/components';

import { CenteredRow } from './_components/CenteredRow';
import { ColoredSection } from './_components/ColoredSection';
import { Heading } from './_components/Heading';
import { Layout } from './_components/Layout';
import { PaperCenteredRow } from './_components/PaperCenteredRow';
import { Spacing } from './_components/Spacing';
import { Text } from './_components/Text';
import { testOrder } from './constants';
import { OrderWithRelations } from './types';

export interface OrderShippedProps {
  order: OrderWithRelations;
  orderLink: string;
  siteOrigin: string;
}

// TODO: Deduplicate
const localPickupInformation = {
  name: 'Prodejna v Hradci',
  address: {
    city: 'Hradec Kralové',
    postCode: '500 03',
    street: 'Tomkova 1230/4a',
  },
  map: {
    location:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2553.3877819242625!2d15.8321447!3d50.2099736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470c2b2d912fc907%3A0xad7818771f15e6cc!2s4a%2C%20Tomkova%201230%2F4A%2C%20500%2003%20Hradec%20Kr%C3%A1lov%C3%A9!5e0!3m2!1sen!2scz!4v1691750049156!5m2!1sen!2scz',
  },
};

export const isLocalPickup = (
  // delivery: Pick<DeliveryMethod, 'id' | 'name' | 'slug'>
  delivery: any,
) => delivery?.slug === 'local-pickup';

export default function OrderShipped({
  order = testOrder,
  orderLink,
  siteOrigin,
}: OrderShippedProps) {
  const title = isLocalPickup(order.deliveryMethod)
    ? `Objednávka #${order.id} připravena na prodejně`
    : `Objednávka #${order.id} byla odeslána`;

  return (
    <Layout siteOrigin={siteOrigin} title={title}>
      <Section>
        <Row>
          <Column>
            <Heading className="text-center" as="h2">
              {title}
            </Heading>
          </Column>
        </Row>
      </Section>
      <Section>
        <CenteredRow>
          <Text className="text-center" size="normal">
            {isLocalPickup(order.deliveryMethod)
              ? `Vaši objednávku jsme zpracovali a objednané produkty jsme pro Vás připravili na prodejně!`
              : 'Vaši objednávku jsme zpracovali a objednané produkty jsme Vám odeslali! Již brzi vás bude kontaktovat doručovací společnost'}
          </Text>
        </CenteredRow>
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
      {isLocalPickup(order.deliveryMethod) ? (
        <ColoredSection>
          <Spacing />

          <CenteredRow>
            <Heading as="h3" noSpacing>
              Adresa prodejny
            </Heading>
          </CenteredRow>
          <Spacing size="sm" />
          <PaperCenteredRow>
            <address className="not-italic p-3 text-lg text-gray-700">
              <span className="block">{localPickupInformation.name}</span>
              <span className="block mt-2">
                {localPickupInformation.address.street}
              </span>
              <span className="block">
                {localPickupInformation.address.city}{' '}
                {localPickupInformation.address.postCode}
              </span>
            </address>
          </PaperCenteredRow>
          <Spacing />
        </ColoredSection>
      ) : null}
    </Layout>
  );
}
