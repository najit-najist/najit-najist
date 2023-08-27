migrate((db) => {
  const collection = new Collection({
    "id": "vv59w4mb4njh8v5",
    "created": "2023-04-28 19:07:05.301Z",
    "updated": "2023-04-28 19:07:05.301Z",
    "name": "recipe_difficulty",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fnbbqjrf",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": true,
        "options": {
          "min": null,
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
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5");

  return dao.deleteCollection(collection);
})
