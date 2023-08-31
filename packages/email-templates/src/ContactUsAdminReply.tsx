import { Heading } from '@react-email/heading';
import { Text } from './components/Text';
import { Layout } from './components/Layout';
import { Link } from '@react-email/link';

export interface ContactUsAdminReplyProps {
  fullName: string;
  message: string;
  telephone?: string;
  email: string;
}

export default function ContactUsAdminReply({
  email,
  fullName,
  message,
  telephone,
}: ContactUsAdminReplyProps) {
  const title = 'Nový kontakt v kontaktním formuláři';

  return (
    <Layout title={title}>
      <Heading as="h2">Zpráva od: {fullName}</Heading>
      <Text>
        <b>Text: </b> <span>{message}</span>
      </Text>

      {telephone ? <Text>Telefon: {telephone} </Text> : null}

      <Link href={`mailto:${email}`}>Odpovědět na uvedený email: {email}</Link>
    </Layout>
  );
}
