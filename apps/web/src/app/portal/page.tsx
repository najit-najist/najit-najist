import { Section } from '@components/portal';
import { FC } from 'react';
import { WelcomeMessage } from './_components/WelcomeMessage';

const PortalPage: FC = () => {
  return (
    <Section>
      <WelcomeMessage />
    </Section>
  );
};

export default PortalPage;
