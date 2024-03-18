/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "0bx7xplr8p1b3zu",
    "created": "2024-03-03 21:25:22.065Z",
    "updated": "2024-03-03 21:25:22.065Z",
    "name": "comgate_transactions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "c6xsp2nd",
        "name": "transaction_id",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "5qmndvb6",
        "name": "order",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "9gfme52i6ojp8r4",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_VIBBNYC` ON `comgate_transactions` (`transaction_id`)",
      "CREATE UNIQUE INDEX `idx_0UjxMWw` ON `comgate_transactions` (`order`)"
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
  const collection = dao.findCollectionByNameOrId("0bx7xplr8p1b3zu");

  return dao.deleteCollection(collection);
})
