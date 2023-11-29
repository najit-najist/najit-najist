import PocketBase from 'pocketbase';

export * from 'pocketbase';
export { default as PocketBase } from 'pocketbase';

export enum Collections {
  USERS = 'users',
  POSTS = 'posts',
  RECIPES = 'recipes',
  RECIPE_TYPES = 'recipe_types',
  RECIPE_RESOURCE_METRIC = 'recipe_resource_metric',
  USER_LIKED_POSTS = 'user_liked_posts',
  USER_LIKED_RECIPES = 'user_liked_recipes',
  RECIPE_DIFFICULTY = 'recipe_difficulty',
  POST_CATEGORIES = 'post_categories',
  CONTACT_FORM_REPLIES = 'contact_form_replies',
  USER_ADDRESSES = 'user_addresses',
  MUNICIPALITY = 'municipality',
  NEWSLETTER_SUBSCRIPTIONS = 'newsletter_subscriptions',
  PREVIEW_SUBSCRIBERS_TOKENS = 'preview_subscribers_tokens',

  PRODUCTS = 'products',
  PRODUCT_STOCK = 'product_stock',
  PRODUCT_PRICES = 'product_prices',
  PRODUCT_CATEGORIES = 'product_categories',

  USER_CARTS = 'user_carts',
  USER_CART_PRODUCTS = 'user_cart_products',

  ORDERS = 'orders',
  ORDER_PRODUCTS = 'order_products',
  ORDER_PAYMENT_METHODS = 'order_payment_methods',
  ORDER_DELIVERY_METHODS = 'order_delivery_methods',
}

export const pocketbase = new PocketBase(String(process.env.POCKETBASE_ORIGIN));

pocketbase.autoCancellation(false);

export const pocketbaseByCollections = {
  users: pocketbase.collection(Collections.USERS),
  products: pocketbase.collection(Collections.PRODUCTS),
  userCarts: pocketbase.collection(Collections.USER_CARTS),
  userCartProducts: pocketbase.collection(Collections.USER_CART_PRODUCTS),
  userAddresses: pocketbase.collection(Collections.USER_ADDRESSES),

  productStocks: pocketbase.collection(Collections.PRODUCT_STOCK),
  productPrices: pocketbase.collection(Collections.PRODUCT_PRICES),
  orders: pocketbase.collection(Collections.ORDERS),
  orderProducts: pocketbase.collection(Collections.ORDER_PRODUCTS),
  orderPaymentMethods: pocketbase.collection(Collections.ORDER_PAYMENT_METHODS),
  orderDeliveryMethods: pocketbase.collection(
    Collections.ORDER_DELIVERY_METHODS
  ),
};
