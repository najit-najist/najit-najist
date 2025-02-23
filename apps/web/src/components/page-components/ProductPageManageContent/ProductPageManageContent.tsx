import { Alert } from '@components/common/Alert';
import { Badge } from '@components/common/Badge';
import { BreadcrumbItem, Breadcrumbs } from '@components/common/Breadcrumbs';
import { Price } from '@components/common/Price';
import { Tooltip } from '@components/common/Tooltip';
import { ProductWithRelationsLocal } from '@custom-types';
import { StarIcon, TagIcon } from '@heroicons/react/24/solid';
import { products } from '@najit-najist/database/models';
import { getCachedDeliveryMethods } from '@server/utils/getCachedDeliveryMethods';
import { getCachedTrpcCaller } from '@server/utils/getCachedTrpcCaller';
import { getFileUrl } from '@server/utils/getFileUrl';
import clsx from 'clsx';
import HTMLReactParser from 'html-react-parser';
import { FC, PropsWithChildren } from 'react';

import { CustomImage } from './CustomImage';
import { EditorHeader } from './EditorHeader';
import { UserActions } from './UserActions';
import { AlergensEdit } from './editorComponents/AlergensEdit';
import { AvailibilityEdit } from './editorComponents/AvailabilityEdit';
import { CategoryEdit } from './editorComponents/CategoryEdit';
import { DescriptionEdit } from './editorComponents/DescriptionEdit';
import { EditorOnlyDeliveryMethodRenderer } from './editorComponents/EditorOnlyDeliveryMethodRenderer';
import { Form } from './editorComponents/Form';
import { ImagesEdit } from './editorComponents/ImagesEdit';
import { ManufacturerEdit } from './editorComponents/ManufacturerEdit';
import { OnlyDeliveryMethodBadge } from './editorComponents/OnlyDeliveryMethodBadge';
import { PriceEditor } from './editorComponents/PriceEditor';
import { ProductCompositionsEdit } from './editorComponents/ProductCompositionsEdit';
import { StockEdit } from './editorComponents/StockEdit';
import { TitleEdit } from './editorComponents/TitleEdit';
import { WeightEdit } from './editorComponents/WeightEdit';

const Title: FC<PropsWithChildren> = ({ children }) => (
  <h3 className="mb-2 text-2xl font-semibold font-title">{children}</h3>
);

export type ProductPageManageContentProps = {
  isEditorHeaderShown?: boolean;
} & (
  | { viewType: 'edit'; product: ProductWithRelationsLocal }
  | {
      viewType: 'view';
      product: ProductWithRelationsLocal;
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
    <hr className="bg-ocean-200 border-0 h-0.5 w-full m-0 mb-3" />
  );
  const [categories, deliveryMethods] = await Promise.all([
    (await getCachedTrpcCaller()).products.categories.get.many(),
    getCachedDeliveryMethods(),
  ]);

  const deliveryMethodsAsObject = Object.fromEntries(
    deliveryMethods.map((d) => [d.id, d]),
  );
  const star = <StarIcon className="text-gray-400 w-5" />;

  const content = (
    <>
      {isEditorHeaderShown ? (
        <EditorHeader viewType={props.viewType} product={product} />
      ) : null}
      <div className="container my-3 sm:my-6">
        <Breadcrumbs
          items={[
            { link: '/produkty', text: 'E-Shop' },
            ...(product
              ? ([
                  product.category
                    ? {
                        link: `/produkty?category-slug=${product.category?.slug}`,
                        text: product.category?.name,
                      }
                    : null,
                  {
                    link: `/produkty/${encodeURIComponent(product.slug)}`,
                    text: product?.name,
                    active: true,
                  },
                ].filter(Boolean) as BreadcrumbItem[])
              : [
                  {
                    link: '/administrace/produkty/novy',
                    text: 'Nový',
                    active: true,
                  },
                ]),
          ]}
        />
      </div>
      <div
        data-product-id={product?.id || 'none'}
        className="flex flex-wrap lg:grid grid-cols-12 w-full gap-y-5 lg:gap-x-5 my-5 px-5 max-w-[1920px] mx-auto"
      >
        <div className="w-full md:w-4/12 lg:w-auto lg:col-span-4">
          {props.viewType === 'view' ? (
            <>
              <div className="relative w-full col-span-2 aspect-square">
                <CustomImage
                  onlyImage
                  className={!product?.publishedAt ? 'opacity-40' : ''}
                  src={getFileUrl(
                    products,
                    props.product.id,
                    props.product.images[0].file,
                  )}
                />
                <div className="m-1 absolute top-0 right-0 rounded-project p-1 flex gap-2">
                  {!product?.publishedAt ? (
                    <Badge size="lg" color="red">
                      Nepublikováno
                    </Badge>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-6 gap-3 mt-3">
                {props.product.images.slice(1).map(({ file: imageName }) => (
                  <CustomImage
                    className={!product?.publishedAt ? 'opacity-40' : ''}
                    key={imageName}
                    src={getFileUrl(products, props.product.id, imageName)}
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

        <div className="w-full md:w-8/12 lg:w-auto lg:col-span-7 md:pl-5">
          {isEditorEnabled ? (
            <Alert
              outlined
              heading="Administrace"
              color="warning"
              className="p-3 mb-4"
            >
              <StockEdit />
              <hr className="h-0.5 bg-gray-100 border-none my-3" />
              <AvailibilityEdit deliveryMethods={deliveryMethods} />
            </Alert>
          ) : null}

          <div className="flex gap-5 items-center mb-9">
            {isEditorEnabled ? (
              <CategoryEdit categories={categories.items} />
            ) : product ? (
              <Badge size="lg" color="green">
                <TagIcon className="w-4 h-4" />
                {product.category?.name ?? 'Ostatní'}
              </Badge>
            ) : null}
            {isEditorEnabled ? (
              <EditorOnlyDeliveryMethodRenderer
                deliveryMethods={deliveryMethodsAsObject}
              />
            ) : product && !!product.onlyForDeliveryMethod ? (
              <OnlyDeliveryMethodBadge
                onlyDeliveryMethods={[
                  product.onlyForDeliveryMethod.name.toLowerCase(),
                ]}
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
              process.env.NODE_ENV === 'production' ? 'opacity-0' : '',
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
              <Price value={product!.price!} size="lg" />
            )}
          </div>

          {isEditorEnabled ? (
            <div className="mt-5">
              <WeightEdit />
            </div>
          ) : null}

          {isEditorEnabled ? (
            <div className="mt-5">
              <ManufacturerEdit />
            </div>
          ) : null}

          {product && viewType === 'view' ? (
            <div>
              <div className="flex mt-10">
                <UserActions stock={product.stock} product={product} />
              </div>
              <p className="font-semibold pt-1">
                {product.stock ? (
                  product.stock.value > 0 ? (
                    <small className="text-project-primary">
                      Produkt máme skladem
                    </small>
                  ) : null
                ) : (
                  <small className="text-orange-400">
                    Pouze na objednávku!
                  </small>
                )}
              </p>
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

          {((viewType === 'view' && !!product?.alergens.length) ||
            viewType !== 'view') && (
            <div className="mb-10 mt-12">
              <Title>Alergeny</Title>
              {hrComponent}
              {String(viewType) === 'view' ? (
                <div className="flex flex-wrap gap-x-1 gap-y-1.5">
                  {product?.alergens.map((item, index, items) => (
                    <Tooltip
                      disabled={!item.description}
                      key={item.id}
                      trigger={
                        <p
                          className={clsx(
                            item.description
                              ? 'decoration-dashed underline hover:decoration-solid cursor-help'
                              : undefined,
                          )}
                        >
                          {item.name}
                          {items.length - 1 === index ? null : ', '}
                        </p>
                      }
                    >
                      {item.description}
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <AlergensEdit />
              )}
            </div>
          )}

          {((viewType === 'view' && !!product?.composedOf.length) ||
            viewType !== 'view') && (
            <div className="mb-10 mt-12">
              <Title>Složení</Title>
              {hrComponent}
              {String(viewType) === 'view' ? (
                <div className="flex flex-wrap gap-x-1 gap-y-1.5">
                  {product?.composedOf.map((item, index, items) => (
                    <Tooltip
                      disabled={!item.description}
                      key={item.id}
                      trigger={
                        <p
                          className={clsx(
                            item.description
                              ? 'decoration-dashed underline hover:decoration-solid cursor-help'
                              : undefined,
                          )}
                        >
                          {item.rawMaterial.name}
                          {item.notes ? <> ({item.notes})</> : null}
                          {items.length - 1 === index ? null : ', '}
                        </p>
                      }
                    >
                      {item.description}
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <ProductCompositionsEdit />
              )}
            </div>
          )}

          {!isEditorEnabled && product?.manufacturer ? (
            <div className="mt-12">
              <Title>Výrobce: {product.manufacturer}</Title>
            </div>
          ) : null}
        </div>

        <aside
          className={clsx(
            'w-full lg:w-auto lg:col-span-1',
            viewType == 'create' ? 'opacity-0' : '',
          )}
        />
      </div>
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
