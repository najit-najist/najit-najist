import { buttonStyles } from '@components/common/Button/buttonStyles';
import { LinkIcon } from '@heroicons/react/24/outline';
import { Button, Column, Row, Section } from '@react-email/components';

import { CenteredRow } from './_components/CenteredRow';
import { Heading } from './_components/Heading';
import { Layout } from './_components/Layout';
import { Spacing } from './_components/Spacing';
import { Text } from './_components/Text';

export type PasswordResetProps = {
  siteOrigin: string;
  token: string;
};

export default function PasswordReset({
  siteOrigin,
  token,
}: PasswordResetProps) {
  const finishUrl = `${siteOrigin}/zapomenute-heslo/dokonceni/${token}`;

  return (
    <Layout
      siteOrigin={siteOrigin}
      title={'Dokončení obnovy hesla na najitnajist.cz'}
    >
      <Section>
        <Row>
          <Column>
            <Heading className="text-center" as="h2">
              Dokončení obnovy hesla na najitnajist.cz
            </Heading>
          </Column>
        </Row>
      </Section>
      <Section>
        <CenteredRow>
          <Text className="text-center" size="medium">
            Zažádali jste si o obnovu hesla. <br /> Pro dokončení obnovy hesla
            pokračujte klikem na toto tlačítko:
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
              Dokončit
            </Button>
          </Column>
        </Row>
        <Spacing size="lg" />
      </Section>
    </Layout>
  );
}

PasswordReset.PreviewProps = {
  siteOrigin: 'http://localhost:3000',
  token: '',
} satisfies PasswordResetProps;
