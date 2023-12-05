/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bofyqfpk36b7nkh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "h5o2lsgn",
    "name": "notes",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bofyqfpk36b7nkh")

  // remove
  collection.schema.removeField("h5o2lsgn")

  return dao.saveCollection(collection)
})
