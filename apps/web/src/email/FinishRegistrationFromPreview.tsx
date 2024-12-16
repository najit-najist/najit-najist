import { Button, Column, Container, Row } from '@react-email/components';

import { Heading } from './_components/Heading';
import { Layout } from './_components/Layout';
import { Text } from './_components/Text';

export interface FinishRegistrationFromPreviewProps {
  fullName: string;
  token: string;
  siteOrigin: string;
}

export default function FinishRegistrationFromPreview({
  fullName,
  token,
  siteOrigin,
}: FinishRegistrationFromPreviewProps) {
  const title = 'Vítejte u najitnajist.cz';

  return (
    <Layout siteOrigin={siteOrigin} title={title}>
      <Heading className="text-center" as="h2">
        {title}
      </Heading>

      <Text className="text-center text-lg">
        Děkujeme za projevení zájmu. <br />
        Spustili jsme pro Vás nový web kde už nyní můžete využít našich receptů
        a dočíst se více v našich článcích. Dále postupně připravujeme spoustu
        novinek a výhod!
      </Text>
      <Row>
        <Column align="center">
          <Button
            href={`${siteOrigin}/registrace/dokonceni-vernostniku/${token}`}
            className="px-3 py-3 bg-project-primary text-white font-semibold rounded-project "
          >
            Pokračovat v registraci zde!
          </Button>
        </Column>
      </Row>
    </Layout>
  );
}

FinishRegistrationFromPreview.PreviewProps = {
  fullName: 'My Full Name',
  siteOrigin: 'http://localhost:3000',
  token: 'testtest',
} satisfies FinishRegistrationFromPreviewProps;
