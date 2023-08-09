migrate((db) => {
  const collection = new Collection({
    "id": "fk4lafqifo7mo3b",
    "created": "2023-08-09 19:31:15.536Z",
    "updated": "2023-08-09 19:31:15.536Z",
    "name": "user_addresses",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mzbeytne",
        "name": "municipality",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "lq3lvziphfijlro",
          "cascadeDelete": false,
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
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b");

  return dao.deleteCollection(collection);
})
