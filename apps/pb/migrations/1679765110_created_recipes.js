migrate((db) => {
  const collection = new Collection({
    "id": "5upb6wjdha0povx",
    "created": "2023-03-25 17:25:10.396Z",
    "updated": "2023-03-25 17:25:10.396Z",
    "name": "recipes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bwffmuio",
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
        "id": "gayd4hhk",
        "name": "images",
        "type": "file",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 10,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/png",
            "image/vnd.mozilla.apng",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/tiff",
            "image/svg+xml"
          ],
          "thumbs": []
        }
      },
      {
        "system": false,
        "id": "2tzoogpa",
        "name": "description",
        "type": "editor",
        "required": true,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx");

  return dao.deleteCollection(collection);
})
