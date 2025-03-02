DO
$do$
DECLARE
    _productToDeliveryMethod RECORD;
    _deliveryMethod RECORD;
BEGIN
    FOR _productToDeliveryMethod IN SELECT * FROM "products_to_delivery_methods"
    LOOP
        SELECT INTO _deliveryMethod * FROM "order_delivery_methods" WHERE id=_productToDeliveryMethod.method_id;
        UPDATE products_to_delivery_methods SET "method_slug" = _deliveryMethod.slug WHERE id = _productToDeliveryMethod.id;
    END LOOP;
END
$do$;


ALTER TABLE "products_to_delivery_methods" DROP CONSTRAINT "products_to_delivery_methods_method_id_order_delivery_methods_id_fk";
--> statement-breakpoint
ALTER TABLE "products_to_delivery_methods" DROP COLUMN IF EXISTS "method_id";
