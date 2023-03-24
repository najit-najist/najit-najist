migrate((db) => {
  const collection = new Collection({
    "id": "cbv7ymiczsfde5v",
    "created": "2023-03-24 20:21:04.992Z",
    "updated": "2023-03-24 20:21:04.992Z",
    "name": "posts",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "iczky3e3",
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
        "id": "l7xwkjnu",
        "name": "slug",
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
        "id": "olhwc6va",
        "name": "description",
        "type": "editor",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "e6mu9fu4",
        "name": "publishedAt",
        "type": "date",
        "required": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "5btra0tr",
        "name": "content",
        "type": "editor",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "eezmyrnt",
        "name": "image",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/png",
            "image/vnd.mozilla.apng",
            "image/jpeg",
            "image/jpx",
            "image/gif",
            "image/webp",
            "image/tiff",
            "image/x-icon",
            "image/svg+xml"
          ],
          "thumbs": []
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
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v");

  return dao.deleteCollection(collection);
})
