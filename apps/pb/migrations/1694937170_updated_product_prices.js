/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("419qoh29l0vzxn3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "98grdf3a",
    "name": "value",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("419qoh29l0vzxn3")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "98grdf3a",
    "name": "value",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
