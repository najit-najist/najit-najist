import { PageTitle } from '@components/common/PageTitle';
import { paperStyles } from '@components/common/Paper';
import { Skeleton } from '@components/common/Skeleton';
import { dayjs } from '@dayjs';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { database } from '@najit-najist/database';
import { getCachedOrders } from '@server/utils/getCachedOrders';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
import { getCachedUsers } from '@server/utils/getCachedUsers';
import { getLoggedInUserId } from '@server/utils/server';
import { formatPrice } from '@utils';
import clsx from 'clsx';
import Link from 'next/link';
import { FC, PropsWithChildren, ReactNode, Suspense } from 'react';

const Item: FC<{
  title: string;
  href?: string;
  createdAt?: Date | string | null;
  className?: string;
  size?: 'small' | 'normal';
}> = ({ title, href, createdAt, className, size = 'normal' }) => {
  const content = (
    <>
      {createdAt ? (
        <span className="text-xs block text-gray-500">
          Vytvořeno {dayjs(createdAt).fromNow()}
        </span>
      ) : null}
      <span
        className={clsx({
          'text-lg block': size === 'normal',
          block: size === 'small',
        })}
      >
        {title}
      </span>
    </>
  );
  const rootClassName = paperStyles({
    className: clsx('hover:border-project-primary', className, {
      'py-3 px-5': size === 'normal',
      'py-1 px-3': size === 'small',
    }),
  });

  if (!href) {
    return <div className={rootClassName}>{content}</div>;
  }

  return (
    <Link href={href as any} className={rootClassName}>
      {content}
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
  beforeItems,
  afterItems,
}: PropsWithChildren<{
  title: string;
  more?: { title: string; url: string };
  add?: { title: string; url: string };
  beforeItems?: ReactNode;
  afterItems?: ReactNode;
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
      {beforeItems}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full my-2">
        {children}
      </div>
      {afterItems}
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
  const loggedInUserId = await getLoggedInUserId();

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
          href={
            loggedInUserId === item.id
              ? '/muj-ucet/profil'
              : `/administrace/uzivatele/${item.id}`
          }
          title={
            loggedInUserId === item.id
              ? 'Já'
              : `${item.firstName} ${item.lastName}`
          }
        />
      ))}
    </GroupRoot>
  );
}

async function RecipesGroup() {
  const trpc = await getCachedTrpcCaller();
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
        url: '/administrace/recepty/novy',
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
  const trpc = await getCachedTrpcCaller();
  const { items } = await trpc.posts.getMany({
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
        url: '/administrace/clanky/novy',
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
  const trpc = await getCachedTrpcCaller();
  const { items } = await trpc.products.get.many({
    perPage: 4,
  });

  return (
    <GroupRoot
      title="E-Shop"
      more={{
        title: 'Zobrazit další produkty',
        url: '/produkty',
      }}
      add={{
        title: 'Přidat produkt',
        url: '/administrace/produkty/novy',
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
  const thisMonth = dayjs();
  const prevMonth = dayjs().set('month', thisMonth.get('month') - 1);

  const ordersThisMonth = await database.query.orders.findMany({
    where: (schema, { lte, gte, and }) =>
      and(
        gte(schema.createdAt, thisMonth.startOf('month').toDate()),
        lte(schema.createdAt, thisMonth.endOf('month').toDate()),
      ),
  });

  const ordersPrevMonth = await database.query.orders.findMany({
    where: (schema, { lte, gte, and }) =>
      and(
        gte(schema.createdAt, prevMonth.startOf('month').toDate()),
        lte(schema.createdAt, prevMonth.endOf('month').toDate()),
      ),
  });

  const thisMonthTotal = ordersThisMonth.reduce(
    (total, current) =>
      total +
      current.subtotal +
      (current.paymentMethodPrice ?? 0) +
      (current.deliveryMethodPrice ?? 0),
    0,
  );
  const prevMonthTotal = ordersPrevMonth.reduce(
    (total, current) =>
      total +
      current.subtotal +
      (current.paymentMethodPrice ?? 0) +
      (current.deliveryMethodPrice ?? 0),
    0,
  );

  return (
    <GroupRoot
      title="Objednávky"
      more={{
        title: 'Zobrazit další objednávky',
        url: '/administrace/objednavky',
      }}
      afterItems={
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mt-0 my-2">
            <Item
              size="small"
              title={`Vytvořeno tento měsíc: ${ordersThisMonth.length}`}
              className={clsx({
                '!border-green-300/30 !bg-green-100/50':
                  ordersThisMonth.length >= ordersPrevMonth.length,
                '!border-orange-300/30 !bg-orange-100/50':
                  ordersThisMonth.length < ordersPrevMonth.length,
              })}
            />
            <Item
              size="small"
              title={`Nakoupeno za tento měsíc: ${formatPrice(thisMonthTotal)}`}
              className={clsx({
                '!border-green-300/30 !bg-green-100/50':
                  thisMonthTotal >= prevMonthTotal,
                '!border-orange-300/30 !bg-orange-100/50':
                  thisMonthTotal < prevMonthTotal,
              })}
            />
          </div>
        </>
      }
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

async function MaterialsGroup() {
  const items = await database.query.productRawMaterials.findMany({ limit: 4 });

  return (
    <GroupRoot
      title="Suroviny"
      more={{
        title: 'Zobrazit další suroviny',
        url: '/administrace/suroviny',
      }}
      add={{
        title: 'Přidat surovinu',
        url: '/administrace/suroviny/novy',
      }}
    >
      {items.map((item) => (
        <Item
          key={item.id}
          createdAt={item.createdAt}
          href={`/administrace/suroviny/${item.id}`}
          title={`${item.name}`}
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
          <OrdersGroup />
        </Suspense>
        <Suspense fallback={<GroupSkeleton />}>
          <UserGroup />
        </Suspense>
        <Suspense fallback={<GroupSkeleton />}>
          <RecipesGroup />
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
        <Suspense fallback={<GroupSkeleton />}>
          <MaterialsGroup />
        </Suspense>
      </div>
    </div>
  );
}
