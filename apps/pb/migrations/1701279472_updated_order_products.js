/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9dhjdkoigmx70sx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iblq1vm1",
    "name": "totalPrice",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9dhjdkoigmx70sx")

  // remove
  collection.schema.removeField("iblq1vm1")

  return dao.saveCollection(collection)
})
