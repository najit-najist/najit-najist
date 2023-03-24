migrate((db) => {
  const collection = new Collection({
    "id": "vwxfzn18sc65gso",
    "created": "2023-03-24 20:21:45.145Z",
    "updated": "2023-03-24 20:21:45.145Z",
    "name": "post_categories",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bagrkgnm",
        "name": "title",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "cftdft7x",
        "name": "slug",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("vwxfzn18sc65gso");

  return dao.deleteCollection(collection);
})
