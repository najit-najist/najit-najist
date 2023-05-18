import {
  AvailableModels,
  getFileUrl,
  Recipe,
  RecipeResourceMetric,
} from '@najit-najist/api';
import { FC, PropsWithChildren } from 'react';
import { Aside } from './Aside';
import HTMLReactParser from 'html-react-parser';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { Form } from './editorComponents/Form';
import { ResourcesEdit } from './editorComponents/ResourcesEdit';
import { ResourcesRenderer } from './editorComponents/ResourcesRenderer';
import { StepsEdit } from './editorComponents/StepsEdit';
import { StepsRenderer } from './editorComponents/StepsRenderer';
import { TitleEdit } from './editorComponents/TitleEdit';
import { EditorHeader } from './EditorHeader';
import { CustomImage } from './CustomImage';
import { ImagesEdit } from './editorComponents/ImagesEdit';

const Title: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="mb-2 text-xl font-semibold">{children}</h3>
);

export type RecipePageManageContentProps = {
  isEditorHeaderShown?: boolean;
  metrics: RecipeResourceMetric[];
} & (
  | { viewType: 'edit'; recipe: Recipe }
  | {
      viewType: 'view';
      recipe: Recipe;
    }
  | { viewType: 'create' }
);

export const RecipePageManageContent: FC<RecipePageManageContentProps> = ({
  metrics,
  isEditorHeaderShown,
  ...props
}) => {
  const { viewType } = props;
  const recipe = props.viewType !== 'create' ? props.recipe : undefined;
  const { created, updated, title } = recipe ?? {};
  const isEditorEnabled = props.viewType !== 'view';

  const content = (
    <>
      <div className="grid grid-cols-12 w-full gap-5 my-5 px-5 max-w-[1920px] mx-auto">
        <div className="col-span-4">
          {props.viewType === 'view' ? (
            <>
              <CustomImage
                src={getFileUrl(
                  AvailableModels.RECIPES,
                  props.recipe.id,
                  props.recipe.images[0]
                )}
              />
              <div className="grid grid-cols-6 gap-3 mt-3">
                {props.recipe.images.slice(1, -1).map((imageUrl) => (
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

        <div className="col-span-6 pl-5">
          <span className="mt-5 mb-3 text-sm uppercase font-semibold text-[#5266B4] block">
            Recept
          </span>
          {!isEditorEnabled ? (
            <h1 className="text-4xl font-suez">{title}</h1>
          ) : (
            <TitleEdit />
          )}
          {isEditorEnabled ? (
            <>Type and difficulty edit</>
          ) : (
            <p className="mt-1 ">
              {props.recipe.type.title}, {props.recipe.difficulty.name}
            </p>
          )}

          <div className="my-10">
            <Title>Popisek</Title>
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
                  props.recipe.numberOfPortions ? (
                    `${props.recipe.numberOfPortions} porcí`
                  ) : (
                    'Neuvedeno'
                  )
                ) : (
                  <>Portions editor</>
                )}
              </div>
            </div>
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
            <Title>Postup</Title>
            {!isEditorEnabled ? (
              <StepsRenderer steps={props.recipe.steps} />
            ) : (
              <StepsEdit />
            )}
          </div>
        </div>

        <aside className="col-span-2">
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
