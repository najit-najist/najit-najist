import { PageTitle } from '@components/common/PageTitle';
import { dayjs } from '@dayjs';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import { Skeleton, paperStyles } from '@najit-najist/ui';
import { getCachedOrders } from '@server/utils/getCachedOrders';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
import { getCachedUsers } from '@server/utils/getCachedUsers';
import Link from 'next/link';
import { FC, PropsWithChildren, Suspense } from 'react';

const Item: FC<{
  title: string;
  href: string;
  createdAt?: Date | string | null;
}> = ({ title, href, createdAt }) => {
  return (
    <Link
      href={href as any}
      className={paperStyles({
        className: 'hover:border-project-primary py-3 px-5',
      })}
    >
      {createdAt ? (
        <span className="text-xs block text-gray-500">
          Vytvořeno {dayjs(createdAt).fromNow()}
        </span>
      ) : null}
      <span className="text-lg block">{title}</span>
    </Link>
  );
};

export const metadata = {
  title: 'Administrace',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

function GroupRoot({
  children,
  title,
  add,
  more,
}: PropsWithChildren<{
  title: string;
  more?: { title: string; url: string };
  add?: { title: string; url: string };
}>) {
  return (
    <div className="flex flex-wrap w-full pt-5 pb-3">
      <h3 className="text-2xl font-title">
        {more ? (
          <Link
            className="hover:text-project-primary hover:underline "
            href={more.url}
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full my-3">
        {children}
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {more ? (
          <Link
            href={more.url}
            className="text-sm hover:underline hover:text-project-primary text-gray-500"
          >
            <EyeIcon className="w-4 inline mr-1 -mt-1" />
            {more.title}
          </Link>
        ) : null}
        {add ? (
          <Link
            href={add.url}
            className="text-sm hover:underline hover:text-project-primary text-gray-500"
          >
            <PlusIcon className="w-4 inline mr-1 -mt-1" />
            {add.title}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function GroupSkeleton() {
  const itemSkeleton = <Skeleton className="h-[75px] w-full" />;
  return (
    <div className="w-full pb-4 pt-6">
      <Skeleton className="h-9 w-24" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full my-3">
        {itemSkeleton}
        {itemSkeleton}
        {itemSkeleton}
        {itemSkeleton}
      </div>
      <Skeleton className="h-5 w-52" />
    </div>
  );
}

async function UserGroup() {
  const { items } = await getCachedUsers({
    perPage: 4,
  });

  return (
    <GroupRoot
      title="Uživatelé"
      more={{
        title: 'Zobrazit další uživatele',
        url: '/administrace/uzivatele',
      }}
      add={{
        title: 'Přidat uživatele',
        url: '/administrace/uzivatele/novy',
      }}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          createdAt={item.createdAt}
          href={`/administrace/uzivatele/${item.id}`}
          title={`${item.firstName} ${item.lastName}`}
        />
      ))}
    </GroupRoot>
  );
}

async function RecipesGroup() {
  const trpc = getCachedTrpcCaller();
  const { items } = await trpc.recipes.getMany({
    perPage: 4,
  });

  return (
    <GroupRoot
      title="Recepty"
      more={{
        title: 'Zobrazit další recepty',
        url: '/recepty',
      }}
      add={{
        title: 'Přidat recept',
        url: '/recepty/novy',
      }}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          createdAt={item.createdAt}
          href={`/recepty/${encodeURIComponent(item.slug)}`}
          title={item.title}
        />
      ))}
    </GroupRoot>
  );
}

async function PostsGroup() {
  const { items } = await getCachedTrpcCaller().posts.getMany({
    perPage: 4,
  });

  return (
    <GroupRoot
      title="Články"
      more={{
        title: 'Zobrazit další články',
        url: '/clanky',
      }}
      add={{
        title: 'Přidat článek',
        url: '/clanky/novy',
      }}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          createdAt={item.createdAt}
          href={`/clanky/${encodeURIComponent(item.slug)}`}
          title={item.title}
        />
      ))}
    </GroupRoot>
  );
}

async function ProductsGroup() {
  const { items } = await getCachedTrpcCaller().products.get.many({
    perPage: 4,
  });

  return (
    <GroupRoot
      title="Produkty"
      more={{
        title: 'Zobrazit další produkty',
        url: '/produkty',
      }}
      add={{
        title: 'Přidat produkt',
        url: '/produkty/novy',
      }}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          createdAt={item.createdAt}
          href={`/produkty/${encodeURIComponent(item.slug)}`}
          title={item.name}
        />
      ))}
    </GroupRoot>
  );
}

async function OrdersGroup() {
  const { items } = await getCachedOrders({ perPage: 4 });

  return (
    <GroupRoot
      title="Objednávky"
      more={{
        title: 'Zobrazit další objednávky',
        url: '/administrace/objednavky',
      }}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          createdAt={item.createdAt}
          href={`/administrace/objednavky/${item.id}`}
          title={`Objednávka #${item.id}`}
        />
      ))}
    </GroupRoot>
  );
}

async function CouponsGroup() {
  const items = await database.query.coupons.findMany({ limit: 4 });

  return (
    <GroupRoot
      title="Kupony"
      more={{
        title: 'Zobrazit další kupony',
        url: '/administrace/kupony',
      }}
      add={{
        title: 'Přidat kupon',
        url: '/administrace/kupony/novy',
      }}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          createdAt={item.createdAt}
          href={`/administrace/kupony/${item.id}`}
          title={`Kupon #${item.id}`}
        />
      ))}
    </GroupRoot>
  );
}

export default async function Page() {
  return (
    <div className="container py-20">
      <PageTitle>{metadata.title}</PageTitle>
      <div className="flex flex-col gap-2 mt-5 items-center divide-y-2">
        <Suspense fallback={<GroupSkeleton />}>
          <UserGroup />
        </Suspense>
        <Suspense fallback={<GroupSkeleton />}>
          <RecipesGroup />
        </Suspense>
        <Suspense fallback={<GroupSkeleton />}>
          <OrdersGroup />
        </Suspense>
        <Suspense fallback={<GroupSkeleton />}>
          <CouponsGroup />
        </Suspense>
        <Suspense fallback={<GroupSkeleton />}>
          <PostsGroup />
        </Suspense>
        <Suspense fallback={<GroupSkeleton />}>
          <ProductsGroup />
        </Suspense>
      </div>
    </div>
  );
}
