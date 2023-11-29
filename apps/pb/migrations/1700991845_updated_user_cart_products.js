/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m5fufxozoyqxrx7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "00ik9q8x",
    "name": "cart",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "3f94c9ngyuuyj2v",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m5fufxozoyqxrx7")

  // remove
  collection.schema.removeField("00ik9q8x")

  return dao.saveCollection(collection)
})
