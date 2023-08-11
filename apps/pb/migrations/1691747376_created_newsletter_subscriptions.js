/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "kckzs0d16egkbj4",
    "created": "2023-08-11 09:49:36.577Z",
    "updated": "2023-08-11 09:49:36.577Z",
    "name": "newsletter_subscriptions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "exgmpjbv",
        "name": "uuid",
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
        "id": "vtwgzhiq",
        "name": "email",
        "type": "email",
        "required": true,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_jLH3Tv7` ON `newsletter_subscriptions` (\n  `email`,\n  `uuid`\n)"
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
  const collection = dao.findCollectionByNameOrId("kckzs0d16egkbj4");

  return dao.deleteCollection(collection);
})
