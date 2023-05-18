import {
  RecipesService,
  RecipeDifficultyService,
} from '@najit-najist/api/server';
import { SearchForm } from './_components/SearchForm';
import { Item } from './_components/Item';

type Params = {
  searchParams: { query?: string };
};

export const metadata = {
  title: 'Recepty',
};

export const revalidate = 30;

export default async function RecipesPage({ searchParams }: Params) {
  const { query } = searchParams;

  const recipesService = new RecipesService();
  const recipeDifficultyService = new RecipeDifficultyService();
  const recipes = await recipesService.getMany();
  const recipeDifficulties = await recipeDifficultyService.getMany();
  const fallbackDifficulty = {
    id: 'default',
    slug: '',
    name: 'Všechny',
    color: '',
    created: '',
    updated: '',
  };

  return (
    <>
      <SearchForm
        difficulties={[fallbackDifficulty, ...recipeDifficulties.items]}
        initialValues={{ query, difficulty: fallbackDifficulty }}
      />
      <div className="container grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10">
        {recipes.items.map((props) => (
          <Item key={props.id} {...props} />
        ))}
      </div>
    </>
  );
}
