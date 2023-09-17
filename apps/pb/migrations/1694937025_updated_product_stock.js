/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hv3648fgmvb2m4e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vak8cqea",
    "name": "count",
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
  const collection = dao.findCollectionByNameOrId("hv3648fgmvb2m4e")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vak8cqea",
    "name": "count",
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
