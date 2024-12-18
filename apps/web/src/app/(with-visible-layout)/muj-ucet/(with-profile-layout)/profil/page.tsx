import { Section } from '@components/portal';
import { getAuthorizedUserOrRequestLogin } from '@server/utils/getAuthorizedUserOrRequestLogin';

import { DeleteMyAccountSection } from './DeleteMyAccountSection';
import { LogoutLink } from './LogoutLink';
import { MyOrdersSection } from './MyOrdersSection';
import { NewsletterSection } from './NewsletterSection';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Můj profil',
};

export default async function Page() {
  const user = await getAuthorizedUserOrRequestLogin();

  return (
    <div className="space-y-5">
      <Section>
        <div className="px-5 flex justify-between items-center mt-3">
          <h1 className="text-2xl font-title tracking-wide">
            Vítejte, {user.firstName} {user.lastName}!
          </h1>

          <LogoutLink />
        </div>
      </Section>
      <MyOrdersSection user={user} />
      <NewsletterSection />
      {/* <hr />
      <DeleteMyAccountSection /> */}
    </div>
  );
}
