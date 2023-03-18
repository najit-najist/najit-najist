import { Section } from '@components/portal';
import { FC } from 'react';

const PortalPage: FC<{ params: { userId: string } }> = ({ params }) => {
  return (
    <Section>
      Toto je stránka pro úpravu uživatele pod id {params.userId}
    </Section>
  );
};

export default PortalPage;
