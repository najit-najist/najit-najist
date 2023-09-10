import { Heading } from '@react-email/heading';
import { Text } from './components/Text';
import { Layout } from './components/Layout';
import { Link } from '@react-email/link';

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
      <Heading as="h2">Dobrý den {fullName},</Heading>
      <Text>
        děkujeme za zanechání kontaktu na našem webu{' '}
        <Link href="https://najitnajist.cz">najitnajist.cz</Link>. <br />{' '}
        Zanedlouho Vás budeme kontaktovat zpět.
      </Text>

      <Text className="italic">
        Váš team <Link href="https://najitnajist.cz">najitnajist.cz</Link>
      </Text>
    </Layout>
  );
}
