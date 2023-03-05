migrate((db) => {
  const collection = new Collection({
    "id": "twvyrbjo3o1zf3v",
    "created": "2023-01-01 10:40:25.049Z",
    "updated": "2023-01-01 10:40:25.049Z",
    "name": "api_controllers",
    "type": "auth",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "o7icxtpk",
        "name": "name",
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
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "allowEmailAuth": true,
      "allowOAuth2Auth": true,
      "allowUsernameAuth": true,
      "exceptEmailDomains": null,
      "manageRule": null,
      "minPasswordLength": 8,
      "onlyEmailDomains": null,
      "requireEmail": false
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("twvyrbjo3o1zf3v");

  return dao.deleteCollection(collection);
})
