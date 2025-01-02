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
  order,
  orderLink,
  siteOrigin,
}: OrderConfirmedProps) {
  const title = `Potvrzení objednávky #${order.id}`;

  return (
    <Layout siteOrigin={siteOrigin} title={title}>
      <Section>
        <CenteredRow>
          <Heading as="h2" className="mb-0">
            {title}
          </Heading>
        </CenteredRow>
        <CenteredRow>
          <Text>
            Gratulujeme! Vaši objednávku jsme potvrdili a začínáme na ní
            pracovat. <br />
            Již brzy Vás budeme informovat o dalších krocích.
          </Text>
        </CenteredRow>
        <CenteredRow>
          <Spacing size="md" />
          <Button
            className={buttonStyles({
              className: 'px-5 py-4 !inline-block',
            })}
            href={orderLink}
          >
            <InformationCircleIcon className="w-5 mr-2 -mb-1" strokeWidth={2} />
            Zobrazit detail objednávky
          </Button>
          <Spacing size="md" />
        </CenteredRow>
        <Spacing />
      </Section>
    </Layout>
  );
}

OrderConfirmed.PreviewProps = {
  siteOrigin: 'http://localhost:3000',
  order: testOrder,
  orderLink: 'http://localhost:3000/test',
} satisfies OrderConfirmedProps;
