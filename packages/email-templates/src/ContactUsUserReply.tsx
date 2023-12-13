import { Column, Row, Section } from '@react-email/components';
import { Heading } from '@react-email/heading';
import { Link } from '@react-email/link';

import { CenteredRow } from './components/CenteredRow';
import { Layout } from './components/Layout';
import { Text } from './components/Text';

export interface ContactUsUserReplyProps {
  fullName: string;
  message: string;
  telephone?: string;
  email: string;
}

export default function ContactUsUserReply({
  email,
  fullName,
  message,
  telephone,
}: ContactUsUserReplyProps) {
  const title = 'Děkujeme za zprávu';

  return (
    <Layout title={title}>
      <Section>
        <CenteredRow>
          <Heading as="h2">Dobrý den {fullName},</Heading>
        </CenteredRow>
        <CenteredRow>
          <Text>
            děkujeme za zanechání kontaktu na našem webu{' '}
            <Link href="https://najitnajist.cz">najitnajist.cz</Link>. <br />{' '}
            Zanedlouho Vás budeme kontaktovat zpět.
          </Text>
        </CenteredRow>
      </Section>
    </Layout>
  );
}
