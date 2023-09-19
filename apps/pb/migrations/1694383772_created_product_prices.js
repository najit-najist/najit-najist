/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "419qoh29l0vzxn3",
    "created": "2023-09-10 22:09:32.577Z",
    "updated": "2023-09-10 22:09:32.577Z",
    "name": "product_prices",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "98grdf3a",
        "name": "value",
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
        "id": "vmdsldbo",
        "name": "discount",
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
        "id": "vqm9gvmm",
        "name": "product",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "ts0cq43ojr833ru",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
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
  const collection = dao.findCollectionByNameOrId("419qoh29l0vzxn3");

  return dao.deleteCollection(collection);
})
