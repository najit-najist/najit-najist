/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "hv3648fgmvb2m4e",
    "created": "2023-09-10 22:12:39.465Z",
    "updated": "2023-09-10 22:12:39.465Z",
    "name": "product_stock",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vak8cqea",
        "name": "count",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "vnmrdgho",
        "name": "product",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "ts0cq43ojr833ru",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_h05TKy9` ON `product_stock` (`product`)"
    ],
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
  const collection = dao.findCollectionByNameOrId("hv3648fgmvb2m4e");

  return dao.deleteCollection(collection);
})
