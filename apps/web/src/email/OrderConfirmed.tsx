import { buttonStyles } from '@components/common/Button/buttonStyles';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Order } from '@najit-najist/database/models';
import { Button, Column, Row, Section } from '@react-email/components';

import { CenteredRow } from './_components/CenteredRow';
import { Heading } from './_components/Heading';
import { Layout } from './_components/Layout';
import { Spacing } from './_components/Spacing';
import { Text } from './_components/Text';
import { testOrder } from './constants';

export interface OrderConfirmedProps {
  order: Order;
  orderLink: string;
  siteOrigin: string;
}

export default function OrderConfirmed({
  order = testOrder,
  orderLink,
  siteOrigin,
}: OrderConfirmedProps) {
  const title = `Potvrzení objednávky #${order.id}`;

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
