import { buttonStyles } from '@components/common/Button/buttonStyles';
import { LinkIcon } from '@heroicons/react/24/outline';
import { Button, Column, Row, Section } from '@react-email/components';

import { CenteredRow } from './_components/CenteredRow';
import { Heading } from './_components/Heading';
import { Layout } from './_components/Layout';
import { Spacing } from './_components/Spacing';
import { Text } from './_components/Text';

export type WelcomeAndFinishProps = {
  siteOrigin: string;
  token: string;
};

export default function WelcomeAndFinish({
  siteOrigin,
  token,
}: WelcomeAndFinishProps) {
  const finishUrl = `${siteOrigin}/registrace/dokonceni/${token}`;
  return (
    <Layout
      siteOrigin={siteOrigin}
      title={'Potvrzení registrace na najitnajist.cz'}
    >
      <Section>
        <Row>
          <Column>
            <Heading className="text-center" as="h2">
              Vítejte na najitnajist.cz
            </Heading>
          </Column>
        </Row>
      </Section>
      <Section>
        <CenteredRow>
          <Text className="text-center" size="medium">
            Děkujeme za Vaši registraci na najitnajist.cz. <br /> Pro dokončení
            registrace klikněte na tlačítko:
          </Text>
        </CenteredRow>
        <Row>
          <Column align="center">
            <Button
              className={buttonStyles({
                className: 'px-5 py-4 !inline-block',
              })}
              href={finishUrl}
            >
              <LinkIcon className="w-5 mr-2 -mb-1" strokeWidth={2} />
              Dokončit registraci
            </Button>
          </Column>
        </Row>
        <Spacing size="md" />
        <CenteredRow>
          <Text
            color="warning"
            className="text-center my-2"
            size="normal"
            spacing={false}
          >
            Pokud jste o registraci nezažádali tak tento email ignorujte.
          </Text>
        </CenteredRow>
      </Section>
    </Layout>
  );
}

WelcomeAndFinish.PreviewProps = {
  siteOrigin: 'http://localhost:3000',
  token: '',
} satisfies WelcomeAndFinishProps;
