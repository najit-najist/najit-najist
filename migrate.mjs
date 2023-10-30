import PocketBase from 'pocketbase';

export const devPocketbase = new PocketBase(
  'https://dev-pocket.najitnajist.cz'
);
export const prodPocketbase = new PocketBase('https://pocket.najitnajist.cz');

await devPocketbase.admins.authWithPassword('hi@ondrejlangr.cz');
await prodPocketbase.admins.authWithPassword('hi@ondrejlangr.cz');

/**
 * @type {import("./packages/najit-najist-api/dist").Product[]}
 */
const devProducts = await devPocketbase
  .collection('products')
  .getFullList({ perPage: 999, expand: 'category' });

const prodCategories = await prodPocketbase
  .collection('product_categories')
  .getFullList({ perPage: 999 });

const slugToCategoryId = new Map(
  prodCategories.map(({ slug, id }) => [slug, id])
);

for (const product of devProducts) {
  const filesAsRequest = [];

  for (const fileId of product.images) {
    const fileUrl = devPocketbase.files.getUrl(
      {
        collectionName: 'products',
        id: product.id,
      },
      fileId
    );

    filesAsRequest.push(fetch(fileUrl));
  }

  await Promise.all(filesAsRequest);

  const payload = {
    ...product,
    category: slugToCategoryId.get(product.expand.category.slug),
    createdBy: 'u5hafhf8y9dxqk5', // TEREZA
  };

  delete payload.updated;
  delete payload.collectionId;
  delete payload.collectionName;
  delete payload.expand;
  delete payload.images;

  console.log(payload);

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, String(value));
  }

  for (const fileAsPromise of filesAsRequest) {
    const file = await fileAsPromise;

    formData.append('images', await file.blob());
  }

  await prodPocketbase.collection('products').create(formData);
}
