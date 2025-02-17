ALTER TABLE "orders" ADD COLUMN "address_id" integer;

DO
$do$
DECLARE
  _orderAddress RECORD;
BEGIN
    FOR _orderAddress IN SELECT * FROM order_addresses
    LOOP
        UPDATE orders SET address_id = _orderAddress.id WHERE id = _orderAddress.order_id;
    END LOOP;
END
$do$;
