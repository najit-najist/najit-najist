import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';
import { Tooltip } from '@najit-najist/ui';
import { getCachedLoggedInUser, getCachedOrders } from '@server-utils';
import clsx from 'clsx';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FormProvider } from './_components/FormProvider';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Můj profil',
};

export default async function Page() {
  let user = await getCachedLoggedInUser();

  if (!user) {
    notFound();
  }

  const orders = await getCachedOrders({ user: { id: [user.id] } });
  const navigationItems = [
    {
      label: 'Můj profil',
      href: '/muj-ucet/profil',
    },
    {
      label: 'Moje objednávky',
      href: '/muj-ucet/objednavky',
      count: orders.totalItems,
    },
  ];

  const userMenu = (
    <nav className="flex flex-1 flex-col mx-auto mt-10" aria-label="Sidebar">
      <ul role="list" className="-mx-2 space-y-1">
        {navigationItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href as any}
              className={clsx(
                '/muj-ucet/profil' === item.href
                  ? 'bg-gray-100 text-project-accent'
                  : 'text-gray-700 hover:text-project-accent hover:bg-gray-50',
                'group flex gap-x-3 rounded-md p-2 pl-3 text-sm leading-6 font-semibold'
              )}
            >
              {item.label}
              {item.count ? (
                <Tooltip
                  trigger={
                    <span
                      className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                      aria-hidden="true"
                    >
                      {item.count}
                    </span>
                  }
                >
                  Počet objednávek
                </Tooltip>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <FormProvider initialData={user}>
      <EditUserUnderPage
        viewType="edit-myself"
        userId={user.id}
        afterProfileImageSlot={userMenu}
      />
    </FormProvider>
  );
}
