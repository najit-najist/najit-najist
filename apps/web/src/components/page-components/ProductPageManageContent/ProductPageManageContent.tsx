import {
  AvailableModels,
  extractTimeFromSteps,
  getFileUrl,
  Recipe,
} from '@najit-najist/api';
import { FC, PropsWithChildren, ReactElement, Suspense } from 'react';
import { Aside } from './Aside';
import HTMLReactParser from 'html-react-parser';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { Form } from './editorComponents/Form';
import { ResourcesEdit } from './editorComponents/ResourcesEdit/ResourcesEdit';
import { ResourcesRenderer } from './editorComponents/ResourcesRenderer';
import { StepsEdit } from './editorComponents/StepsEdit';
import { StepsRenderer } from './editorComponents/StepsRenderer';
import { TitleEdit } from './editorComponents/TitleEdit';
import { EditorHeader } from './EditorHeader';
import { CustomImage } from './CustomImage';
import { ImagesEdit } from './editorComponents/ImagesEdit';
import {
  RecipeDifficultyService,
  RecipesService,
} from '@najit-najist/api/server';
import { TypeEdit } from './editorComponents/TypeEdit';
import { DifficultyEdit } from './editorComponents/DifficultyEdit';
import { Skeleton } from '@najit-najist/ui';
import { LazyUserListActions } from './LazyUserListActions';
import { PortionsEdit } from './editorComponents/PortionsEdit';

const Title: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="mb-2 text-xl font-semibold">{children}</h3>
);

export type RecipePageManageContentProps = {
  isEditorHeaderShown?: boolean;
} & (
  | { viewType: 'edit'; recipe: Recipe }
  | {
      viewType: 'view';
      recipe: Recipe;
    }
  | { viewType: 'create' }
);

export const ProductPageManageContent = async ({
  isEditorHeaderShown,
  ...props
}: RecipePageManageContentProps): Promise<ReactElement> => {
  const [{ items: metrics }, { items: types }, { items: difficulties }] =
    await Promise.all([
      RecipesService.resourceMetrics.getMany({
        page: 1,
        perPage: 999,
      }),
      RecipesService.types.getMany({ page: 1, perPage: 999 }),
      RecipeDifficultyService.getMany({ page: 1, perPage: 999 }),
    ]);

  const { viewType } = props;
  const recipe = props.viewType !== 'create' ? props.recipe : undefined;
  const { created, updated, title } = recipe ?? {};
  const isEditorEnabled = props.viewType !== 'view';
  const hrComponent = (
    <hr className="bg-ocean-200 border-0 h-0.5 w-full m-0 mb-5" />
  );

  const content = (
    <>
      <div className="flex flex-wrap lg:grid grid-cols-12 w-full gap-y-5 lg:gap-x-5 my-5 px-5 max-w-[1920px] mx-auto">
        <div className="w-full md:w-4/12 lg:w-auto lg:col-span-4">
          {props.viewType === 'view' ? (
            <>
              <div className="relative w-full col-span-2 aspect-square">
                <CustomImage
                  onlyImage
                  src={getFileUrl(
                    AvailableModels.RECIPES,
                    props.recipe.id,
                    props.recipe.images[0]
                  )}
                />
                <div className="m-1 absolute top-0 right-0 rounded-md p-1 flex gap-2">
                  <Suspense
                    fallback={
                      <>
                        <Skeleton className="w-9 h-9" />
                        {/* <Skeleton className="w-9 h-9" /> */}
                      </>
                    }
                  >
                    <LazyUserListActions recipeId={props.recipe.id} />
                  </Suspense>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 mt-3">
                {props.recipe.images.slice(1).map((imageUrl) => (
                  <CustomImage
                    key={imageUrl}
                    src={getFileUrl(
                      AvailableModels.RECIPES,
                      props.recipe.id,
                      imageUrl
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <ImagesEdit
              recipeId={props.viewType === 'edit' ? props.recipe.id : undefined}
            />
          )}
        </div>

        <div className="w-full md:w-8/12 lg:w-auto lg:col-span-6 md:pl-5">
          <span className="mt-5 mb-3 text-sm uppercase font-semibold text-ocean-400 block font-title">
            Recept
          </span>
          {!isEditorEnabled ? (
            <h1 className="text-4xl font-title">{title}</h1>
          ) : (
            <TitleEdit />
          )}
          <div className="flex grid-cols-2 gap-1">
            {isEditorEnabled ? (
              <>
                <TypeEdit types={types} />
                <DifficultyEdit difficulties={difficulties} />
              </>
            ) : (
              <p className="mt-1">
                {props.recipe.type.title}, {props.recipe.difficulty.name}
              </p>
            )}
          </div>

          <div className="my-10">
            <Title>Popisek</Title>
            {hrComponent}
            {!isEditorEnabled ? (
              <div>{HTMLReactParser(props.recipe.description)}</div>
            ) : (
              <DescriptionEdit />
            )}
          </div>

          <div className="my-10">
            <div className="flex justify-between items-center">
              <Title>Suroviny</Title>
              <div>
                {!isEditorEnabled ? (
                  <span className="text-deep-green-300">
                    Počet porcí:{' '}
                    <b>
                      {props.recipe.numberOfPortions
                        ? `${props.recipe.numberOfPortions} porcí`
                        : 'Neuvedeno'}
                    </b>
                  </span>
                ) : (
                  <PortionsEdit />
                )}
              </div>
            </div>
            {hrComponent}
            {!isEditorEnabled ? (
              <ResourcesRenderer
                metrics={metrics}
                resources={props.recipe.resources}
              />
            ) : (
              <ResourcesEdit metrics={metrics} />
            )}
          </div>

          <div className="my-10">
            <div className="flex justify-between items-center">
              <Title>Postup</Title>
              <div>
                {!isEditorEnabled ? (
                  <span className="text-deep-green-300">
                    Celkem:{' '}
                    <b>{extractTimeFromSteps(props.recipe.steps)} minut</b>
                  </span>
                ) : null}
              </div>
            </div>
            {hrComponent}
            {!isEditorEnabled ? (
              <StepsRenderer steps={props.recipe.steps} />
            ) : (
              <StepsEdit />
            )}
          </div>
        </div>

        <aside className="w-full lg:w-auto lg:col-span-2">
          {isEditorEnabled ? (
            <Aside created={created} updated={updated} />
          ) : null}
        </aside>
      </div>
      {isEditorHeaderShown ? <EditorHeader viewType={props.viewType} /> : null}
    </>
  );

  if (viewType === 'view') {
    return content;
  }

  return (
    <Form viewType={viewType} recipe={recipe}>
      {content}
    </Form>
  );
};