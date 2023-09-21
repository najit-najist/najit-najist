/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dwbtsewh",
    "name": "publishedAt",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  // remove
  collection.schema.removeField("dwbtsewh")

  return dao.saveCollection(collection)
})
