migrate((db) => {
  const collection = new Collection({
    "id": "bbaa9o2kzz8pwtn",
    "created": "2023-04-28 18:47:32.030Z",
    "updated": "2023-04-28 18:47:32.030Z",
    "name": "recipe_resource_type",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ppy2p44c",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": 1,
          "max": null,
          "pattern": ""
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn");

  return dao.deleteCollection(collection);
})
