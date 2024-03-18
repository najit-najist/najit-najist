import { Heading, Link, Section } from '@react-email/components';

import { CenteredRow } from './_components/CenteredRow';
import { Layout } from './_components/Layout';
import { Text } from './_components/Text';

export interface ContactUsAdminReplyProps {
  fullName: string;
  message: string;
  telephone?: string;
  email: string;
  siteOrigin: string;
}

export default function ContactUsAdminReply({
  email,
  fullName,
  message,
  telephone,
  siteOrigin,
}: ContactUsAdminReplyProps) {
  const title = 'Nový kontakt v kontaktním formuláři';

  return (
    <Layout siteOrigin={siteOrigin} title={title}>
      <Section>
        <CenteredRow>
          <Heading as="h2">Zpráva od: {fullName}</Heading>
        </CenteredRow>
        <CenteredRow>
          <Text>
            <b>Text: </b> <span>{message}</span>
          </Text>
          {telephone ? <Text>Telefon: {telephone} </Text> : null}
          <Text>
            <Link href={`mailto:${email}`}>
              Odpovědět na uvedený email: {email}
            </Link>
          </Text>
        </CenteredRow>
      </Section>
    </Layout>
  );
}
