migrate((db) => {
  const collection = new Collection({
    "id": "2ljho6yocaxpjcm",
    "created": "2023-03-25 17:25:48.059Z",
    "updated": "2023-03-25 17:25:48.059Z",
    "name": "recipe_types",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "gnbkgscz",
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
        "id": "854uoi7w",
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
  const collection = dao.findCollectionByNameOrId("2ljho6yocaxpjcm");

  return dao.deleteCollection(collection);
})
