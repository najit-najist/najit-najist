import { InformationCircleIcon } from '@heroicons/react/24/outline';
// import type { Order } from '@najit-najist/api';
import { buttonStyles } from '@najit-najist/ui/dist/Button/buttonStyles';
import { Button } from '@react-email/button';
import { Column, Row } from '@react-email/components';
import { Section } from '@react-email/section';

import { CenteredRow } from './components/CenteredRow';
import { Heading } from './components/Heading';
import { Layout } from './components/Layout';
import { Spacing } from './components/Spacing';
import { Text } from './components/Text';
import { testOrder } from './constants';

export interface ThankYouOrderAdminProps {
  // order: Order;
  order: any;
  orderLink: string;
  siteOrigin: string;
}

export default function ThankYouOrderAdmin({
  order = testOrder,
  orderLink,
  siteOrigin,
}: ThankYouOrderAdminProps) {
  const title = `Nová objednávka`;

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
            Dobrý den, uživatel {order.firstName} {order.lastName} vytvořil
            novou objednávku.
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
    </Layout>
  );
}
