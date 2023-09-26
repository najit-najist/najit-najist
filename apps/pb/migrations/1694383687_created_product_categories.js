/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ftw6973jcj4rgvg",
    "created": "2023-09-10 22:08:07.040Z",
    "updated": "2023-09-10 22:08:07.040Z",
    "name": "product_categories",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "1z4lfslm",
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
        "id": "jjlm0xme",
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
    "indexes": [
      "CREATE UNIQUE INDEX `idx_jpqUzcd` ON `product_categories` (`name`)",
      "CREATE UNIQUE INDEX `idx_jJqME8a` ON `product_categories` (`slug`)"
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
  const collection = dao.findCollectionByNameOrId("ftw6973jcj4rgvg");

  return dao.deleteCollection(collection);
})
