import { StarIcon } from '@heroicons/react/24/solid';
import { AvailableModels, getFileUrl, Product } from '@najit-najist/api';
import { Badge } from '@najit-najist/ui';
import { getCachedTrpcCaller } from '@server-utils';
import clsx from 'clsx';
import HTMLReactParser from 'html-react-parser';
import Link from 'next/link';
import { FC, PropsWithChildren } from 'react';

import { Aside } from './Aside';
import { CustomImage } from './CustomImage';
import { EditorHeader } from './EditorHeader';
import { UserActions } from './UserActions';
import { CategoryEdit } from './editorComponents/CategoryEdit';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { Form } from './editorComponents/Form';
import { ImagesEdit } from './editorComponents/ImagesEdit';
import { PriceEditor, PriceRenderer } from './editorComponents/Price';
import { StockEdit } from './editorComponents/StockEdit';
import { TitleEdit } from './editorComponents/TitleEdit';

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
  const categories = await getCachedTrpcCaller().products.categories.get.many();

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
          <div className="flex gap-5 items-center mt-5 mb-3 ">
            {isEditorEnabled ? (
              <>
                <CategoryEdit categories={categories.items} />
              </>
            ) : (
              <Badge color="blue">
                {props.product.category?.name ?? 'Ostatní'}
              </Badge>
            )}
            <Link
              href="/produkty"
              className="text-sm uppercase font-semibold text-ocean-400 block font-title"
            >
              Produkt{' '}
              {!product?.publishedAt ? (
                <span className="text-red-500">- Nepublikováno</span>
              ) : null}
            </Link>
          </div>

          {!isEditorEnabled ? (
            <h1 className="text-5xl font-title">{name}</h1>
          ) : (
            <TitleEdit />
          )}

          <div className="flex flex-wrap items-center grid-cols-2 gap-2 mt-1">
            <div
              className={clsx(
                'flex',
                process.env.NODE_ENV === 'production' ? 'opacity-0' : ''
              )}
            >
              {star}
              {star}
              {star}
              {star}
              {star}
            </div>
          </div>

          <div className="mt-5">
            {isEditorEnabled ? (
              <PriceEditor />
            ) : (
              <PriceRenderer price={product!.price} />
            )}
          </div>

          {viewType !== 'view' ? <StockEdit /> : null}

          {product && viewType === 'view' ? (
            <div className="flex mt-10">
              <UserActions stock={product.stock} productId={product.id} />
            </div>
          ) : null}

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
