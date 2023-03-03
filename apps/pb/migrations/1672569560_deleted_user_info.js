migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("d0kiv3cd2p4gfka");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "d0kiv3cd2p4gfka",
    "created": "2023-01-01 10:21:20.878Z",
    "updated": "2023-01-01 10:21:20.878Z",
    "name": "user_info",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "os8uqsfz",
        "name": "forUser",
        "type": "relation",
        "required": true,
        "unique": true,
        "options": {
          "maxSelect": 1,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
