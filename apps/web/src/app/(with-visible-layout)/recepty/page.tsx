import {
  RecipesService,
  RecipeDifficultyService,
} from '@najit-najist/api/server';
import { SearchForm } from './_components/SearchForm';
import { Item } from './_components/Item';

type Params = {
  searchParams: { query?: string; difficulty?: string; type?: string };
};

export const metadata = {
  title: 'Recepty',
};

export const revalidate = 30;

const fallbackDifficulty = {
  id: 'default',
  slug: '',
  name: 'Všechny',
  color: '',
  created: '',
  updated: '',
};

export default async function RecipesPage({ searchParams }: Params) {
  const {
    query,
    difficulty: difficultySlugFromUrl,
    type: typeSlugFromUrl,
  } = searchParams;
  const userDidSearch = !!query || !!difficultySlugFromUrl || !!typeSlugFromUrl;
  const { items: recipeDifficulties } = await RecipeDifficultyService.getMany();

  const { items: recipes } = await RecipesService.getMany({
    difficultySlug: difficultySlugFromUrl,
    typeSlug: typeSlugFromUrl,
    search: query,
  });

  return (
    <>
      <SearchForm
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
