import {
  RecipesService,
  RecipeDifficultyService,
  RecipeTypeService,
  AuthService,
  getTrpcCaller,
} from '@najit-najist/api/server';
import { SearchForm } from './_components/SearchForm';
import { Item } from './_components/Item';
import { RecipeDifficulty, RecipeType } from '@najit-najist/api';
import { PageTitle } from '@components/common/PageTitle';
import { pocketbase } from '@najit-najist/pb';

type Params = {
  searchParams: { query?: string; difficulty?: string; type?: string };
};

export const metadata = {
  title: 'Recepty',
};

export const revalidate = 0;

const fallbackDifficulty: RecipeDifficulty = {
  id: 'default',
  slug: '',
  name: 'Všechny',
  color: '',
  created: '',
  updated: '',
};

const fallbackType: RecipeType = {
  id: 'default',
  slug: '',
  title: 'Všechny',
  created: '',
  updated: '',
};

export default async function RecipesPage({ searchParams }: Params) {
  const {
    query,
    difficulty: difficultySlugFromUrl,
    type: typeSlugFromUrl,
  } = searchParams;
  await AuthService.authPocketBase();

  const trpc = getTrpcCaller();

  const userDidSearch = !!query || !!difficultySlugFromUrl || !!typeSlugFromUrl;
  const [
    { items: recipeDifficulties },
    { items: recipeTypes },
    { items: recipes },
  ] = await Promise.all([
    trpc.recipes.difficulties.getMany({ perPage: 999 }),
    trpc.recipes.types.getMany({ perPage: 999 }),
    trpc.recipes.getMany({
      difficultySlug: difficultySlugFromUrl,
      typeSlug: typeSlugFromUrl,
      search: query,
      perPage: 999,
    }),
  ]);

  return (
    <>
      <div className="container">
        <PageTitle>{metadata.title}</PageTitle>
      </div>
      <SearchForm
        types={[fallbackType, ...recipeTypes]}
        difficulties={[fallbackDifficulty, ...recipeDifficulties]}
        initialValues={{ query, difficultySlug: difficultySlugFromUrl ?? '' }}
      />
      <div className="container grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10">
        {recipes.length ? (
          recipes.map((props) => <Item key={props.id} {...props} />)
        ) : (
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            {userDidSearch ? (
              <>Pro vaše vyhledávání nemáme žádné recepty ☹️</>
            ) : (
              <>Zatím pro Vás nemáme žádné recepty...</>
            )}
          </div>
        )}
      </div>
    </>
  );
}
