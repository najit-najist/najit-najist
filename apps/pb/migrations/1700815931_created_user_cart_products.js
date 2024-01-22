/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "m5fufxozoyqxrx7",
    "created": "2023-11-24 08:52:11.830Z",
    "updated": "2023-11-24 08:52:11.830Z",
    "name": "user_cart_products",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6xtnyx3t",
        "name": "product",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ts0cq43ojr833ru",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "4ioyvofo",
        "name": "count",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1,
          "max": null,
          "noDecimal": true
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("m5fufxozoyqxrx7");

  return dao.deleteCollection(collection);
})
