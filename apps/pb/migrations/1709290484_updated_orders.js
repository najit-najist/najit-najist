/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gfme52i6ojp8r4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ztzpjxmp",
    "name": "notes",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gfme52i6ojp8r4")

  // remove
  collection.schema.removeField("ztzpjxmp")

  return dao.saveCollection(collection)
})
