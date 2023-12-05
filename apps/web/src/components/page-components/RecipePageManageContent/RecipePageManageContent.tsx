import {
  AvailableModels,
  extractTimeFromSteps,
  getFileUrl,
  Recipe,
} from '@najit-najist/api';
import {
  RecipeDifficultyService,
  RecipesService,
} from '@najit-najist/api/server';
import { Breadcrumbs, Skeleton } from '@najit-najist/ui';
import HTMLReactParser from 'html-react-parser';
import Link from 'next/link';
import { FC, PropsWithChildren, ReactElement, Suspense } from 'react';

import { Aside } from './Aside';
import { CustomImage } from './CustomImage';
import { EditorHeader } from './EditorHeader';
import { LazyUserListActions } from './LazyUserListActions';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { DifficultyEdit } from './editorComponents/DifficultyEdit';
import { Form } from './editorComponents/Form';
import { ImagesEdit } from './editorComponents/ImagesEdit';
import { PortionsEdit } from './editorComponents/PortionsEdit';
import { ResourcesEdit } from './editorComponents/ResourcesEdit/ResourcesEdit';
import { ResourcesRenderer } from './editorComponents/ResourcesRenderer';
import { StepsEdit } from './editorComponents/StepsEdit';
import { StepsRenderer } from './editorComponents/StepsRenderer';
import { TitleEdit } from './editorComponents/TitleEdit';
import { TypeEdit } from './editorComponents/TypeEdit';

const Title: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="mb-2 text-2xl font-semibold font-title">{children}</h3>
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

export const RecipePageManageContent = async ({
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
      <div className="container mt-6 mb-3">
        <Breadcrumbs
          items={[
            { link: '/recepty', text: 'Recepty' },
            ...(recipe
              ? [
                  {
                    link: `/recepty?type=${recipe.type.slug}`,
                    text: recipe.type.title,
                  },

                  {
                    link: `/produkty/${recipe.slug}`,
                    text: recipe.title,
                    active: true,
                  },
                ]
              : [
                  {
                    link: '/recepty/novy',
                    text: 'Nový',
                    active: true,
                  },
                ]),
          ]}
        />
      </div>
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
          {!isEditorEnabled ? (
            <h1 className="text-5xl font-title mt-4">{title}</h1>
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
                  <span className="text-project-primary">
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
                  <span className="text-project-text">
                    Celkem{' '}
                    <b className="text-project-accent">
                      {extractTimeFromSteps(props.recipe.steps)}
                    </b>{' '}
                    minut
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
      {isEditorHeaderShown ? (
        <EditorHeader
          viewType={props.viewType}
          recipe={recipe ? { id: recipe.id, slug: recipe.slug } : undefined}
        />
      ) : null}
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
