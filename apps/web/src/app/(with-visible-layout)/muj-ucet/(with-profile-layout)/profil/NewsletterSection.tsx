import { Section } from '@components/portal';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { FC } from 'react';

import { ChangeNewsletterSubscriptionButton } from './ChangeNewsletterSubscriptionButton';

export const NewsletterSection: FC = async () => {
  const newsletter = await getCachedLoggedInUser();

  return (
    <Section>
      <div className="px-5 sm:flex items-center mt-3 justify-between">
        <h1 className="text-2xl font-title tracking-wide">Newsletter</h1>
        <ChangeNewsletterSubscriptionButton
          initialValue={newsletter?.newsletter?.enabled ?? false}
        />
      </div>
    </Section>
  );
};
