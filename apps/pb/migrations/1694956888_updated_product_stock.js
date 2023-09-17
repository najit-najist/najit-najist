/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hv3648fgmvb2m4e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vnmrdgho",
    "name": "product",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "ts0cq43ojr833ru",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hv3648fgmvb2m4e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vnmrdgho",
    "name": "product",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "ts0cq43ojr833ru",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
