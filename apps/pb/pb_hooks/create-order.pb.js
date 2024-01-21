// @ts-check
/// <reference path="../pb_data/types.d.ts" />

routerAdd('GET', '/cart', (c) => {
  /**
   * @type import("./utils")
   */
  const { fetchCartForUserId } = require(`${__hooks}/utils.js`);
  const info = $apis.requestInfo(c);
  const admin = info?.admin;
  const normalUser = info?.authRecord;
  const user = admin ?? normalUser;

  const isGuest = !user;
  if (isGuest) {
    return c.json(401, {
      message: 'Unauthorized',
      user,
    });
  }

  const cart = fetchCartForUserId(user.id);

  return c.json(200, cart);
});

// TODO: create new route which manages orders, this way we can easily do database manipulation with transactionw
routerAdd(
  'POST',
  '/cart/checkout',
  (c) => {
    /**
     * @type import("./utils")
     */
    const {
      fetchCartForUserId,
      fetchDeliveryMethod,
      fetchPaymentMethod,
      calculatePriceForCartProducts,
      fetchMunicipality,
      getProductPrice,
      getAddressForUser,
      getProductsInsideCart,
      getProductStock,
    } = require(`${__hooks}/utils.js`);
    const info = $apis.requestInfo(c);
    const admin = info?.admin;
    const normalUser = info?.authRecord;
    const user = admin ?? normalUser;

    const isGuest = !user;
    if (isGuest) {
      return c.json(401, {
        message: 'Unauthorized',
        user,
      });
    }
    const { data } = info;

    const requiredBodyFields = [
      'address_houseNumber',
      'address_streetName',
      'address_city',
      'address_postalCode',
      'address_municipality_id',
      'email',
      'telephoneNumber',
      'firstName',
      'lastName',
      'payment_method_id',
      'delivery_method_id',
    ];

    const missingFields = [];

    for (const fieldName of requiredBodyFields) {
      if (!data[fieldName]) {
        missingFields.push(fieldName);
      }
    }

    const cart = fetchCartForUserId(user.id);
    const productsCountInCart = getProductsInsideCart(cart).length;

    if (missingFields.length || productsCountInCart === 0) {
      $app
        .logger()
        .warn(
          'User tried to checkout but failed',
          'missingFields',
          missingFields.join(', '),
          'numberOfProductsInCart',
          productsCountInCart
        );

      return c.json(400, {
        message: missingFields.length
          ? `Missing fields ${missingFields.join(', ')}`
          : 'No products in cart',
      });
    }

    const paymentMethod = fetchPaymentMethod(data.payment_method_id);
    const deliveryMethod = fetchDeliveryMethod(data.delivery_method_id);
    const municipality = fetchMunicipality(data.address_municipality_id);
    const userAddress = getAddressForUser(user);

    const ordersCollection = $app.dao().findCollectionByNameOrId('orders');
    const orderProductsCollection = $app
      .dao()
      .findCollectionByNameOrId('order_products');

    const cartSubtotal = calculatePriceForCartProducts(cart);
    const paymentMethodPrice = paymentMethod.getInt('price');
    const deliveryMethodPrice = deliveryMethod.getInt('price');
    let createdOrderId = undefined;

    $app.dao().runInTransaction((dao) => {
      const newOrder = new Record(ordersCollection);

      newOrder.load({
        subtotal: cartSubtotal,
        user: user.id,

        address_houseNumber: data.address_houseNumber,
        address_streetName: data.address_streetName,
        address_city: data.address_city,
        address_postalCode: data.address_postalCode,
        address_municipality: municipality.id,

        email: data.email,
        telephoneNumber: data.telephoneNumber,

        firstName: data.firstName,
        lastName: data.lastName,

        payment_method: paymentMethod.id,
        delivery_method: deliveryMethod.id,
        payment_method_price: paymentMethodPrice,
        delivery_method_price: deliveryMethodPrice,

        state: paymentMethod.getBool('payment_on_checkout')
          ? 'unpaid'
          : 'unconfirmed',
      });

      dao.saveRecord(newOrder);

      const productsInCarts = cart.expandedAll('user_cart_products(cart)');
      for (const productInCart of productsInCarts) {
        if (!productInCart) {
          continue;
        }
        const newOrderedProduct = new Record(orderProductsCollection);
        const productCount = productInCart.getInt('count');
        const product = productInCart.expandedOne('product');

        newOrderedProduct.load({
          product: product.id,
          order: newOrder.id,
          count: productCount,
          totalPrice: getProductPrice(product) * productCount,
        });

        const productStock = getProductStock(product);

        if (productStock) {
          product.set(
            'count',
            Math.max(productStock.getInt('count') - productCount, 0)
          );

          dao.saveRecord(productStock);
        }
        dao.saveRecord(newOrderedProduct);
      }

      dao.deleteRecord(cart);

      const saveAddressUpdate = data.save_address === 'true';
      if (saveAddressUpdate) {
        userAddress.load({
          municipality: municipality.id,
          houseNumber: data.address_houseNumber,
          streetName: data.address_streetName,
          city: data.address_city,
          postalCode: data.address_postalCode,
        });

        dao.saveRecord(userAddress);
      }

      createdOrderId = newOrder.id;
    });

    return c.json(200, {
      newOrder: {
        id: createdOrderId,
      },
    });
  },
  $apis.requireAdminOrRecordAuth()
);
