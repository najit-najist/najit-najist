/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j124om4wdmpruy2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uwgig9f6",
    "name": "payment_on_checkout",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j124om4wdmpruy2")

  // remove
  collection.schema.removeField("uwgig9f6")

  return dao.saveCollection(collection)
})
