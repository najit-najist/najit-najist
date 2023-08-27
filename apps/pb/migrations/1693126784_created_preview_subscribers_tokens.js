/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "sopozolrryx4wn1",
    "created": "2023-08-27 08:59:44.151Z",
    "updated": "2023-08-27 08:59:44.151Z",
    "name": "preview_subscribers_tokens",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fnjuaump",
        "name": "for",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "n5vehv2v",
        "name": "token",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_9RUJz1l` ON `preview_subscribers_tokens` (`for`)"
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
  const collection = dao.findCollectionByNameOrId("sopozolrryx4wn1");

  return dao.deleteCollection(collection);
})
