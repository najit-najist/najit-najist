import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { buttonStyles } from '@najit-najist/ui';
import { Button } from '@react-email/button';
import { Column, Row } from '@react-email/components';
import { Section } from '@react-email/section';

import { CenteredRow } from './components/CenteredRow';
import { Heading } from './components/Heading';
import { Layout } from './components/Layout';
import { Spacing } from './components/Spacing';
import { Text } from './components/Text';
import { testOrder } from './constants';

export interface OrderConfirmedProps {
  // order: Order;
  order: any;
  orderLink: string;
}

export default function OrderConfirmed({
  order = testOrder,
  orderLink,
}: OrderConfirmedProps) {
  const title = `Potvrzení objednávky #${order.id}`;

  return (
    <Layout title={title}>
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
            Gratulujeme! Vaši objednávku jsme potvrdili a začínáme na ní
            pracovat. <br />
            Již brzy Vás budeme informovat o dalších krocích.
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
        <Spacing />
      </Section>
    </Layout>
  );
}
