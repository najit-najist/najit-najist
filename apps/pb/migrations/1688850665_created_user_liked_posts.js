migrate((db) => {
  const collection = new Collection({
    "id": "jhp91276y58sw5g",
    "created": "2023-07-08 21:11:05.095Z",
    "updated": "2023-07-08 21:11:05.095Z",
    "name": "user_liked_posts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tpekla6l",
        "name": "likedBy",
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
        "id": "echwy0kr",
        "name": "likedItem",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "cbv7ymiczsfde5v",
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
  const collection = dao.findCollectionByNameOrId("jhp91276y58sw5g");

  return dao.deleteCollection(collection);
})
