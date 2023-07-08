migrate((db) => {
  const collection = new Collection({
    "id": "nqxc8xr73z0bh58",
    "created": "2023-07-08 21:09:31.710Z",
    "updated": "2023-07-08 21:09:31.710Z",
    "name": "user_liked_recipes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "z95nfhcv",
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
        "id": "6oh63a62",
        "name": "likedItem",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "5upb6wjdha0povx",
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
  const collection = dao.findCollectionByNameOrId("nqxc8xr73z0bh58");

  return dao.deleteCollection(collection);
})
