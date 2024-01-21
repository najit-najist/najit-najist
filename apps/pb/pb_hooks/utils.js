// @ts-check
/// <reference path="../pb_data/types.d.ts" />

module.exports = {
  CART_EXPAND_CART_ITEMS: 'user_cart_products(cart)',
  CART_EXPAND_CART_PRODUCTS: 'user_cart_products(cart).product',

  /**
   * Gets current cart for userId, upsers if it does not exists
   * @param {string} userId
   */
  fetchCartForUserId(userId) {
    let result;

    try {
      result = $app.dao().findFirstRecordByData('user_carts', 'user', userId);
    } catch (error) {
      const isMissing = error.message.includes('no rows in result set');
      if (!isMissing) {
        throw error;
      }

      const newOrder = new Record(
        $app.dao().findCollectionByNameOrId('user_carts')
      );

      newOrder.set('user', userId);

      $app.dao().saveRecord(newOrder);

      result = newOrder;
    }

    $app
      .dao()
      .expandRecord(
        result,
        ['user_cart_products(cart)', 'user_cart_products(cart).product'],
        null
      );

    const productsInCarts = result.expandedAll('user_cart_products(cart)');
    for (const productInCart of productsInCarts) {
      if (!productInCart) {
        continue;
      }

      const product = productInCart.expandedOne('product');

      // Delete unpublished from cart
      if (!product.getString('publishedAt')) {
        $app.dao().deleteRecord(productInCart);

        continue;
      }

      $app
        .dao()
        .expandRecord(
          product,
          ['product_prices(product)', 'product_stock(product)'],
          null
        );
    }

    return result;
  },

  /**
   *
   * @param {string} paymentMethodId
   */
  fetchPaymentMethod(paymentMethodId) {
    const result = $app
      .dao()
      .findFirstRecordByData('order_payment_methods', 'id', paymentMethodId);

    return result;
  },

  /**
   *
   * @param {string} municipalityid
   */
  fetchMunicipality(municipalityid) {
    const result = $app
      .dao()
      .findFirstRecordByData('municipality', 'id', municipalityid);

    return result;
  },

  /**
   *
   * @param {string} deliveryMethodId
   */
  fetchDeliveryMethod(deliveryMethodId) {
    const result = $app
      .dao()
      .findFirstRecordByData('order_delivery_methods', 'id', deliveryMethodId);

    return result;
  },

  /**
   *
   * @param {models.Record} cart
   */
  getProductsInsideCart(cart) {
    const productsInCarts = cart.expandedAll('user_cart_products(cart)');
    const products = [];

    for (const productInCart of productsInCarts) {
      if (!productInCart) {
        continue;
      }

      // Duplicate products in array
      const productCount = productInCart.getInt('count');
      const product = module.exports.getProductFromProductCart(productInCart);
      for (let index = 0; index < productCount; index++) {
        products.push(product);
      }
    }

    return products;
  },

  /**
   *
   * @param {models.Record} product
   */
  getProductPrice(product) {
    if (product.tableName() !== 'products') {
      throw new Error('Provided product is not a product');
    }

    const price = product.expandedOne('product_prices(product)');

    if (price.tableName() !== 'product_prices') {
      throw new Error('Provided product price is missing for product');
    }

    return price.getInt('value');
  },

  /**
   *
   * @param {models.Record} productInCart
   */
  getProductFromProductCart(productInCart) {
    if (productInCart.tableName() !== 'user_cart_products') {
      throw new Error('Provided product is not in a cart');
    }

    const product = productInCart.expandedOne('product');

    if (product.tableName() !== 'products') {
      throw new Error('Provided product from cart is not a product');
    }

    return product;
  },

  /**
   *
   * @param {models.Record} cart
   */
  calculatePriceForCartProducts(cart) {
    const products = module.exports.getProductsInsideCart(cart);
    let totalPrice = 0;

    for (const product of products) {
      totalPrice += module.exports.getProductPrice(product);
    }

    return totalPrice;
  },

  /**
   *
   * @param {models.Admin | models.Record} user
   */
  getAddressForUser(user) {
    const result = $app
      .dao()
      .findFirstRecordByData('user_addresses', 'owner', user.id);

    return result;
  },

  /**
   *
   * @param {models.Record} product
   * @returns {models.Record|null}
   */
  getProductStock(product) {
    if (product.tableName() !== 'products') {
      throw new Error('Provided product is not a product');
    }

    const stock = product.expandedOne('product_stock(product)');

    if (stock && stock.tableName() !== 'product_stock') {
      throw new Error('Provided product stock is missing for product');
    }

    return stock;
  },
};
