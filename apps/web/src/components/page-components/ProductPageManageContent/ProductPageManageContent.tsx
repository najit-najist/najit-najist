import { AvailableModels, getFileUrl, Product } from '@najit-najist/api';
import { FC, PropsWithChildren } from 'react';
import { Aside } from './Aside';
import HTMLReactParser from 'html-react-parser';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { Form } from './editorComponents/Form';
import { TitleEdit } from './editorComponents/TitleEdit';
import { EditorHeader } from './EditorHeader';
import { CustomImage } from './CustomImage';
import { ImagesEdit } from './editorComponents/ImagesEdit';
import clsx from 'clsx';
import { PriceEditor, PriceRenderer } from './editorComponents/Price';
import { StarIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const Title: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="mb-2 text-2xl font-semibold font-title">{children}</h3>
);

export type ProductPageManageContentProps = {
  isEditorHeaderShown?: boolean;
} & (
  | { viewType: 'edit'; product: Product }
  | {
      viewType: 'view';
      product: Product;
    }
  | { viewType: 'create' }
);

export const ProductPageManageContent: FC<
  ProductPageManageContentProps
> = async ({ isEditorHeaderShown, ...props }) => {
  const { viewType } = props;
  const product = props.viewType !== 'create' ? props.product : undefined;
  const { created, updated, name, publishedAt } = product ?? {};
  const isEditorEnabled = props.viewType !== 'view';
  const hrComponent = (
    <hr className="bg-ocean-200 border-0 h-0.5 w-full m-0 mb-5" />
  );

  const star = <StarIcon className="text-gray-400 w-5" />;

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
                    AvailableModels.PRODUCTS,
                    props.product.id,
                    props.product.images[0]
                  )}
                />
                <div className="m-1 absolute top-0 right-0 rounded-md p-1 flex gap-2"></div>
              </div>
              <div className="grid grid-cols-6 gap-3 mt-3">
                {props.product.images.slice(1).map((imageUrl) => (
                  <CustomImage
                    key={imageUrl}
                    src={getFileUrl(
                      AvailableModels.PRODUCTS,
                      props.product.id,
                      imageUrl
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <ImagesEdit
              productId={
                props.viewType === 'edit' ? props.product.id : undefined
              }
            />
          )}
        </div>

        <div className="w-full md:w-8/12 lg:w-auto lg:col-span-6 md:pl-5">
          <Link
            href="/produkty"
            className="mt-5 mb-3 text-sm uppercase font-semibold text-ocean-400 block font-title"
          >
            Produkt{' '}
            {!product?.publishedAt ? (
              <span className="text-red-500">- Nepublikováno</span>
            ) : null}
          </Link>
          {!isEditorEnabled ? (
            <h1 className="text-4xl font-title">{name}</h1>
          ) : (
            <TitleEdit />
          )}

          <div className="flex opacity-0">
            {star}
            {star}
            {star}
            {star}
            {star}
          </div>

          {/* TODO: add reviews here */}
          <div className="mt-5">
            {isEditorEnabled ? (
              <PriceEditor />
            ) : (
              <PriceRenderer price={product!.price} />
            )}
          </div>

          <div className="my-10">
            <Title>Popisek</Title>
            {hrComponent}
            {!isEditorEnabled ? (
              <div>
                {product!.description ? (
                  HTMLReactParser(product!.description ?? '')
                ) : (
                  <div>Zatím žádný popisek...</div>
                )}
              </div>
            ) : (
              <DescriptionEdit />
            )}
          </div>
        </div>

        <aside
          className={clsx(
            'w-full lg:w-auto lg:col-span-2',
            viewType == 'create' ? 'opacity-0' : ''
          )}
        >
          {isEditorEnabled ? (
            <Aside
              created={created}
              updated={updated}
              publishedAt={publishedAt}
            />
          ) : null}
        </aside>
      </div>
      {isEditorHeaderShown ? (
        <EditorHeader
          viewType={props.viewType}
          product={product ? { id: product.id, slug: product.slug } : undefined}
        />
      ) : null}
    </>
  );

  if (viewType === 'view') {
    return content;
  }

  return (
    <Form viewType={viewType} product={product}>
      {content}
    </Form>
  );
};
