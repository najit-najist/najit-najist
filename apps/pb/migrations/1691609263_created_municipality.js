migrate((db) => {
  const collection = new Collection({
    "id": "lq3lvziphfijlro",
    "created": "2023-08-09 19:27:43.734Z",
    "updated": "2023-08-09 19:27:43.734Z",
    "name": "municipality",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0nid1giu",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "wr4txxzc",
        "name": "slug",
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
  const collection = dao.findCollectionByNameOrId("lq3lvziphfijlro");

  return dao.deleteCollection(collection);
})
