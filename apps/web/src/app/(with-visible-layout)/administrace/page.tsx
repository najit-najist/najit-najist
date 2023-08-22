import { UserRoles } from '@najit-najist/api';
import { getLoggedInUser } from '@najit-najist/api/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC } from 'react';

const Item: FC<{ title: string; href: string }> = ({ title, href }) => {
  return (
    <Link
      href={href as any}
      className="bg-white rounded-lg border-2 border-gray-200 hover:border-deep-green-400 py-2 px-5 block"
    >
      {title}
    </Link>
  );
};

export const metadata = {
  title: 'Administrace',
};

export const revalidate = 0;

export default async function Page() {
  const loggedInUser = await getLoggedInUser().catch(() => undefined);

  if (!loggedInUser || loggedInUser.role !== UserRoles.ADMIN) {
    redirect('/');
  }

  return (
    <div className="container py-20">
      <h1 className="text-4xl font-semibold">Administrace</h1>
      <div className="flex flex-wrap gap-5 mt-5 divide-x-2 items-center">
        <div className="flex gap-5 flex-wrap">
          <Item title="Uživatelé" href="/administrace/uzivatele" />
          <Item title="Nový uživatel" href="/administrace/uzivatele/novy" />
        </div>

        <div className="flex gap-5 flex-wrap pl-4">
          <Item title="Recepty" href="/recepty" />
          <Item title="Nový recept" href="/recepty/novy" />
        </div>

        <div className="flex gap-5 flex-wrap pl-4">
          <Item title="Články" href="/clanky" />
          <Item title="Nový článek" href="/clanky/novy" />
        </div>
      </div>
    </div>
  );
}
