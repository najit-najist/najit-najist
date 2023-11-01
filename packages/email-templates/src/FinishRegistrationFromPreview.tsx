import { Heading } from './components/Heading';
import { Text } from './components/Text';
import { Layout } from './components/Layout';
import { Button } from '@react-email/button';

export interface FinishRegistrationFromPreviewProps {
  fullName: string;
  token: string;
}

export default function FinishRegistrationFromPreview({
  fullName,
  token,
}: FinishRegistrationFromPreviewProps) {
  const title = 'Vítejte u Najít&Najíst';

  return (
    <Layout title={title}>
      <Heading className="text-center" as="h2">
        {title}
      </Heading>

      <Text className="text-center">
        Děkujeme za projevení zájmu. <br />
        Spustili jsme pro Vás nový web kde už nyní můžete využít našich receptů
        a dočíst se více v našich článcích. Dále postupně připravujeme spoustu
        novinek a výhod!
        <Button
          href={`https://najitnajist.cz/registrace/dokonceni-vernostniku/${token}`}
          className="px-3 py-3 bg-project-primary text-white font-semibold rounded-lg mt-5"
        >
          Pokračovat v registraci zde!
        </Button>
      </Text>
    </Layout>
  );
}
