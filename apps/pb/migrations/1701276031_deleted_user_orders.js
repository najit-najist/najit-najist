/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("8y4b2zzmzjsdfr6");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "8y4b2zzmzjsdfr6",
    "created": "2023-11-29 14:05:43.171Z",
    "updated": "2023-11-29 14:06:21.069Z",
    "name": "user_orders",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ha2oellh",
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
      },
      {
        "system": false,
        "id": "dbvwdkjx",
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
    "indexes": [],
    "listRule": "user = @request.auth.id || @request.auth.role = \"ADMIN\"",
    "viewRule": "user = @request.auth.id || @request.auth.role = \"ADMIN\"",
    "createRule": "@request.auth.id != null",
    "updateRule": "@request.auth.role = \"ADMIN\"",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
