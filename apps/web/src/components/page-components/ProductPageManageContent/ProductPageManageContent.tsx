import { DEFAULT_DATE_FORMAT } from '@constants';
import { StarIcon, TagIcon, TruckIcon } from '@heroicons/react/24/solid';
import { Product } from '@najit-najist/api';
import { Collections, getFileUrl } from '@najit-najist/pb';
import {
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
  Input,
  Paper,
  Price,
} from '@najit-najist/ui';
import { getCachedDeliveryMethods, getCachedTrpcCaller } from '@server-utils';
import clsx from 'clsx';
import dayjs from 'dayjs';
import HTMLReactParser from 'html-react-parser';
import { FC, PropsWithChildren } from 'react';

import { CustomImage } from './CustomImage';
import { EditorHeader } from './EditorHeader';
import { UserActions } from './UserActions';
import { AvailibilityEdit } from './editorComponents/AvailabilityEdit';
import { CategoryEdit } from './editorComponents/CategoryEdit';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { EditorOnlyDeliveryMethodRenderer } from './editorComponents/EditorOnlyDeliveryMethodRenderer';
import { Form } from './editorComponents/Form';
import { ImagesEdit } from './editorComponents/ImagesEdit';
import { OnlyDeliveryMethodBadge } from './editorComponents/OnlyDeliveryMethodBadge';
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
  const { name } = product ?? {};
  const isEditorEnabled = props.viewType !== 'view';
  const hrComponent = (
    <hr className="bg-ocean-200 border-0 h-0.5 w-full m-0 mb-5" />
  );
  const [categories, deliveryMethods] = await Promise.all([
    getCachedTrpcCaller().products.categories.get.many(),
    getCachedDeliveryMethods(),
  ]);

  const deliveryMethodsAsObject = Object.fromEntries(
    deliveryMethods.map((d) => [d.id, d])
  );
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
          <div className="flex gap-5 items-center mb-9">
            {isEditorEnabled ? (
              <CategoryEdit categories={categories.items} />
            ) : product ? (
              <Badge size="lg" color="green">
                <TagIcon className="w-4 h-4" />
                {product.category?.name}
              </Badge>
            ) : null}
            {isEditorEnabled ? (
              <EditorOnlyDeliveryMethodRenderer
                deliveryMethods={deliveryMethodsAsObject}
              />
            ) : product && !!product.onlyDeliveryMethods.length ? (
              <OnlyDeliveryMethodBadge
                onlyDeliveryMethods={product.onlyDeliveryMethods
                  .filter((dId) => dId in deliveryMethodsAsObject)
                  .map((deliveryMethodId) =>
                    deliveryMethodsAsObject[deliveryMethodId].name.toLowerCase()
                  )}
              />
            ) : null}
          </div>

          {!isEditorEnabled ? (
            <h1 className="text-5xl font-title mt-4">{name}</h1>
          ) : (
            <TitleEdit />
          )}

          <div
            className={clsx(
              'flex flex-wrap items-center grid-cols-2 gap-2 mt-2',
              process.env.NODE_ENV === 'production' ? 'opacity-0' : ''
            )}
          >
            <div className={clsx('flex')}>
              {star}
              {star}
              {star}
              {star}
              {star}
            </div>
            <div className="w-0.5 h-5 relative mx-2">
              <span className="w-full left-0 h-3/4 bg-gray-200 absolute top-1/2 -translate-y-1/2"></span>
            </div>
            <div>0 recenzí</div>
          </div>

          <div className="mt-5">
            {isEditorEnabled ? (
              <PriceEditor />
            ) : (
              <Price value={product!.price.value} size="lg" />
            )}
          </div>

          {product && viewType === 'view' ? (
            <div className="flex mt-10">
              <UserActions stock={product.stock} product={product} />
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
                  <div>Bez popisku...</div>
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
            <>
              <Paper className="p-3">
                <StockEdit />
              </Paper>
              <Paper className="p-3 mt-4">
                <AvailibilityEdit deliveryMethods={deliveryMethods} />
              </Paper>
              {product?.created || product?.updated || product?.publishedAt ? (
                <Paper className="p-3 mt-4">
                  <h3 className="font-bold font-title">Časová osa</h3>
                  <hr className="h-0.5 bg-gray-100 border-none mt-2 mb-3" />
                  <div className="grid gap-5">
                    {product?.created ? (
                      <Input
                        label="Vytvořeno"
                        value={dayjs(product.created).format(
                          DEFAULT_DATE_FORMAT
                        )}
                        disabled
                      />
                    ) : null}

                    {product?.updated ? (
                      <Input
                        label="Upraveno"
                        value={dayjs(product.updated).format(
                          DEFAULT_DATE_FORMAT
                        )}
                        disabled
                      />
                    ) : null}

                    {product?.publishedAt ? (
                      <Input
                        label="Publikováno"
                        value={dayjs(product.publishedAt).format(
                          DEFAULT_DATE_FORMAT
                        )}
                        disabled
                      />
                    ) : null}
                  </div>
                </Paper>
              ) : null}
            </>
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
