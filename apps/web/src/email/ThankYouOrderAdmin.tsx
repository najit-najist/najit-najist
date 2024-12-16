import { buttonStyles } from '@components/common/Button/buttonStyles';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Order } from '@najit-najist/database/models';
import { Column, Row, Button, Section } from '@react-email/components';

import { CenteredRow } from './_components/CenteredRow';
import { Heading } from './_components/Heading';
import { Layout } from './_components/Layout';
import { Spacing } from './_components/Spacing';
import { Text } from './_components/Text';
import { testOrder } from './constants';

export interface ThankYouOrderAdminProps {
  order: Order;
  orderLink: string;
  siteOrigin: string;
}

export default function ThankYouOrderAdmin({
  order,
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
          <Text className="text-center" size="medium">
            Dobrý den, uživatel {order.firstName} {order.lastName} vytvořil
            novou objednávku.
          </Text>
        </CenteredRow>
        <Row>
          <Column align="center">
            <Button
              className={buttonStyles({
                className: 'px-5 py-4 !inline-block',
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

ThankYouOrderAdmin.PreviewProps = {
  siteOrigin: 'http://localhost:3000',
  order: testOrder,
  orderLink: 'http://localhost:3000/test',
} satisfies ThankYouOrderAdminProps;
