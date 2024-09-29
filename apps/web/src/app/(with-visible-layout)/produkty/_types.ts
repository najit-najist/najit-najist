export type ProductsMainPageParams = {
  searchParams: { query?: string; 'category-slug'?: string; sort?: string };
};

export enum ProductsPageSortBy {
  RECOMMENDED = 'recommended',
  PRICE_ASCENDING = 'price-ascending',
  PRICE_DESCENDING = 'price-descending',
}
