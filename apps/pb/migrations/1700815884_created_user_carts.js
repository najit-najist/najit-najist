/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "3f94c9ngyuuyj2v",
    "created": "2023-11-24 08:51:24.736Z",
    "updated": "2023-11-24 08:51:24.736Z",
    "name": "user_carts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "m3lwjtmb",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_h632O0T` ON `user_carts` (`user`)"
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
  const collection = dao.findCollectionByNameOrId("3f94c9ngyuuyj2v");

  return dao.deleteCollection(collection);
})
