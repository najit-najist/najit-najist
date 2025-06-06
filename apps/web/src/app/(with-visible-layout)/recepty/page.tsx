import { BreadcrumbItem, Breadcrumbs } from '@components/common/Breadcrumbs';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { PageDescription } from '@components/common/PageDescription';
import { PageHeader } from '@components/common/PageHeader';
import { PageTitle } from '@components/common/PageTitle';
import {
  RecipePreviewMedium,
  RecipePreviewMediumSkeleton,
} from '@components/common/RecipePreviewMedium';
import { Skeleton } from '@components/common/Skeleton';
import { PlusIcon } from '@heroicons/react/24/solid';
import {
  RecipeCategory,
  RecipeDifficulty,
  recipes as recipesModel,
} from '@najit-najist/database/models';
import { UserActions, canUser } from '@server/utils/canUser';
import { getCachedLoggedInUser } from '@server/utils/getCachedLoggedInUser';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
import Link from 'next/link';
import { FC, Suspense } from 'react';

import { SearchForm } from './_components/SearchForm';

type Params = {
  searchParams: Promise<{ query?: string; difficulty?: string; type?: string }>;
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
  const trpc = await getCachedTrpcCaller();
  const {
    query,
    difficulty: difficultySlugFromUrl,
    type: typeSlugFromUrl,
  } = await searchParams;

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
      <RecipePreviewMedium
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
  const trpc = await getCachedTrpcCaller();
  const {
    query,
    difficulty: difficultySlugFromUrl,
    type: typeSlugFromUrl,
  } = await searchParams;

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
        "difficulty[slug]": difficultySlugFromUrl ?? '',
        "type[slug]": typeSlugFromUrl ?? '',
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
    <Link
      href="/administrace/recepty/novy"
      className={buttonStyles({
        appearance: 'ghost',
        className: 'w-16 h-16 !px-2',
      })}
    >
      <PlusIcon className="inline w-12" />
    </Link>
  ) : null;
};

export default async function RecipesPage({ searchParams }: Params) {
  const breadcrumbs: BreadcrumbItem[] = [
    { link: '/recepty', text: 'Recepty', active: true },
  ];

  return (
    <>
      <div className="hidden sm:block container mx-auto mt-6 mb-2">
        <Breadcrumbs items={breadcrumbs} />
      </div>
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
          <div className="container mb-10 flex flex-col-reverse md:flex-row w-full gap-5 items-end">
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

      <div className="container grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10">
        <Suspense
          fallback={new Array(8).fill(true).map((_, index) => (
            <RecipePreviewMediumSkeleton key={index} />
          ))}
        >
          <Items searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
