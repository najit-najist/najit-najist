import { StarIcon } from '@heroicons/react/24/solid';
import { Product } from '@najit-najist/api';
import { Collections, getFileUrl } from '@najit-najist/pb';
import { Badge, BreadcrumbItem, Breadcrumbs, Price } from '@najit-najist/ui';
import { getCachedTrpcCaller } from '@server-utils';
import clsx from 'clsx';
import HTMLReactParser from 'html-react-parser';
import { FC, PropsWithChildren } from 'react';

import { Aside } from './Aside';
import { CustomImage } from './CustomImage';
import { EditorHeader } from './EditorHeader';
import { UserActions } from './UserActions';
import { CategoryEdit } from './editorComponents/CategoryEdit';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { Form } from './editorComponents/Form';
import { ImagesEdit } from './editorComponents/ImagesEdit';
import { PriceEditor } from './editorComponents/PriceEditor';
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
      <div className="container mt-6 mb-3">
        <Breadcrumbs
          items={[
            { link: '/produkty', text: 'Produkty' },
            ...(product
              ? ([
                  product.category
                    ? {
                        link: `/produkty?category-slug=${product.category?.slug}`,
                        text: product.category?.name,
                      }
                    : null,
                  {
                    link: `/produkty/${product.slug}`,
                    text: product?.name,
                    active: true,
                  },
                ].filter(Boolean) as BreadcrumbItem[])
              : [
                  {
                    link: '/produkty/novy',
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
                  className={!product?.publishedAt ? 'opacity-40' : ''}
                  src={getFileUrl(
                    Collections.PRODUCTS,
                    props.product.id,
                    props.product.images[0]
                  )}
                />
                <div className="m-1 absolute top-0 right-0 rounded-md p-1 flex gap-2">
                  {!product?.publishedAt ? (
                    <Badge size="lg" color="red">
                      Nepublikováno
                    </Badge>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 mt-3">
                {props.product.images.slice(1).map((imageUrl) => (
                  <CustomImage
                    className={!product?.publishedAt ? 'opacity-40' : ''}
                    key={imageUrl}
                    src={getFileUrl(
                      Collections.PRODUCTS,
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
          {isEditorEnabled ? (
            <div className="flex gap-5 items-center mt-5 mb-3 ">
              <CategoryEdit categories={categories.items} />
            </div>
          ) : null}

          {!isEditorEnabled ? (
            <h1 className="text-5xl font-title mt-4">{name}</h1>
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
              <Price value={product!.price.value} size="lg" />
            )}
          </div>

          {viewType !== 'view' ? <StockEdit /> : null}

          {product && viewType === 'view' ? (
            <div className="flex mt-10">
              <UserActions stock={product.stock} productId={product.id} />
            </div>
          ) : null}

          <div className="mb-10 mt-12">
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
