import { Recipe, RecipeResourceMetric } from '@najit-najist/api';
import HTMLReactParser from 'html-react-parser';
import { FC, PropsWithChildren } from 'react';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { ResourcesEdit } from './editorComponents/ResourcesEdit';
import { ResourcesRenderer } from './editorComponents/ResourcesRenderer';
import { StepsEdit } from './editorComponents/StepsEdit';
import { StepsRenderer } from './editorComponents/StepsRenderer';
import { TitleEdit } from './editorComponents/TitleEdit';

const Title: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="mb-2 text-xl font-semibold">{children}</h3>
);

export const MainContent: FC<{
  isEditorEnabled?: boolean;
  recipe: Recipe;
  metrics: RecipeResourceMetric[];
}> = ({ recipe, metrics, isEditorEnabled }) => {
  const {
    type,
    difficulty,
    description,
    title,
    numberOfPortions,
    resources,
    steps,
  } = recipe;

  return (
    <>
      <div className="col-span-6 pl-5">
        <span className="mt-5 mb-3 text-sm uppercase font-semibold text-ocean-400 block">
          Recept
        </span>
        {!isEditorEnabled ? (
          <h1 className="text-4xl font-suez">{title}</h1>
        ) : (
          <TitleEdit />
        )}
        <p className="mt-1 ">
          {type.title}, {difficulty.name}
        </p>

        <div className="my-10">
          <Title>Popisek</Title>
          {!isEditorEnabled ? (
            <div>{HTMLReactParser(description)}</div>
          ) : (
            <DescriptionEdit />
          )}
        </div>

        <div className="my-10">
          <div className="flex justify-between items-center">
            <Title>Suroviny</Title>
            <div>
              {numberOfPortions ? `${numberOfPortions} porcí` : 'Neuvedeno'}
            </div>
          </div>
          {!isEditorEnabled ? (
            <ResourcesRenderer metrics={metrics} resources={resources} />
          ) : (
            <ResourcesEdit metrics={metrics} />
          )}
        </div>

        <div className="my-10">
          <Title>Postup</Title>
          {!isEditorEnabled ? <StepsRenderer steps={steps} /> : <StepsEdit />}
        </div>
      </div>
    </>
  );
};
