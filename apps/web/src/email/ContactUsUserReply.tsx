import { Heading, Link, Section } from '@react-email/components';

import { CenteredRow } from './_components/CenteredRow';
import { Layout } from './_components/Layout';
import { Text } from './_components/Text';

export interface ContactUsUserReplyProps {
  fullName: string;
  message: string;
  telephone?: string;
  email: string;
  siteOrigin: string;
}

export default function ContactUsUserReply({
  email,
  fullName,
  message,
  telephone,
  siteOrigin,
}: ContactUsUserReplyProps) {
  const title = 'Děkujeme za zprávu';

  return (
    <Layout siteOrigin={siteOrigin} title={title}>
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
