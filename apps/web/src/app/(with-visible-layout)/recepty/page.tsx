import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  RecipeCategory,
  RecipeDifficulty,
  recipes as recipesModel,
} from '@najit-najist/database/models';
import { Skeleton } from '@najit-najist/ui';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
import Link from 'next/link';
import { FC, Suspense } from 'react';

import { Item } from './_components/Item';
import { ItemSkeleton } from './_components/ItemSkeleton';
import { SearchForm } from './_components/SearchForm';

type Params = {
  searchParams: { query?: string; difficulty?: string; type?: string };
};

export const metadata = {
  title: 'Recepty',
  description:
    'Vyberte si z naší kolekce receptů zaměřenou pro lidi s intolerancí',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const fallbackDifficulty: RecipeDifficulty = {
  id: 0,
  slug: '',
  name: 'Všechny',
  color: '',
  createdAt: null,
  updatedAt: null,
};

const fallbackType: RecipeCategory = {
  id: 0,
  slug: '',
  title: 'Všechny',
  createdAt: null,
  updatedAt: null,
};

const Items: FC<Params> = async ({ searchParams }) => {
  const trpc = getCachedTrpcCaller();
  const {
    query,
    difficulty: difficultySlugFromUrl,
    type: typeSlugFromUrl,
  } = searchParams;

  const userDidSearch = !!query || !!difficultySlugFromUrl || !!typeSlugFromUrl;
  const [{ items: recipes }, currentUser] = await Promise.all([
    trpc.recipes.getMany({
      difficultySlug: difficultySlugFromUrl,
      typeSlug: typeSlugFromUrl,
      search: query,
      perPage: 999,
    }),
    getCachedLoggedInUser(),
  ]);

  return recipes.length ? (
    recipes.map((props) => (
      <Item
        key={props.id}
        loggedInUser={currentUser ? { role: currentUser.role } : undefined}
        {...props}
      />
    ))
  ) : (
    <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
      {userDidSearch ? (
        <>Pro vaše vyhledávání nemáme žádné recepty ☹️</>
      ) : (
        <>Zatím pro Vás nemáme žádné recepty...</>
      )}
    </div>
  );
};

const Form: FC<Params> = async ({ searchParams }) => {
  const trpc = getCachedTrpcCaller();
  const {
    query,
    difficulty: difficultySlugFromUrl,
    type: typeSlugFromUrl,
  } = searchParams;

  const [{ items: recipeDifficulties }, { items: recipeCategories }] =
    await Promise.all([
      trpc.recipes.difficulties.getMany({ perPage: 999 }),
      trpc.recipes.types.getMany({ perPage: 999 }),
    ]);

  return (
    <SearchForm
      types={[fallbackType, ...recipeCategories]}
      difficulties={[fallbackDifficulty, ...recipeDifficulties]}
      initialValues={{
        query,
        difficultySlug: difficultySlugFromUrl ?? '',
        typeSlug: typeSlugFromUrl ?? '',
      }}
    />
  );
};

const AddNewButton: FC = async () => {
  const currentUser = await getCachedLoggedInUser();

  return currentUser &&
    canUser(currentUser, {
      action: UserActions.CREATE,
      onModel: recipesModel,
    }) ? (
    <Link href="/recepty/novy" className="">
      <PlusIcon className="inline w-12" />
    </Link>
  ) : null;
};

export default function RecipesPage({ searchParams }: Params) {
  return (
    <>
      <PageHeader className="container">
        <div className="flex justify-between items-center">
          <PageTitle>{metadata.title}</PageTitle>
          <Suspense fallback={null}>
            <AddNewButton />
          </Suspense>
        </div>
        <PageDescription>{metadata.description}</PageDescription>
      </PageHeader>
      <Suspense
        fallback={
          <div className="container my-10 flex flex-col-reverse md:flex-row w-full gap-5 items-end">
            <Skeleton className="w-full h-11" />
            <div className="md:max-w-[240px] w-full">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="w-full h-11 mt-1" />
            </div>
            <div className="md:max-w-[240px] w-full">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="w-full h-11 mt-1" />
            </div>
          </div>
        }
      >
        <Form searchParams={searchParams} />
      </Suspense>

      <div className="container grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10">
        <Suspense
          fallback={new Array(8).fill(true).map((_, index) => (
            <ItemSkeleton key={index} />
          ))}
        >
          <Items searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
