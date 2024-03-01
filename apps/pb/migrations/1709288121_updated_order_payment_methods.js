/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j124om4wdmpruy2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ano6ozx2",
    "name": "slug",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "card",
        "wire",
        "prepay_wire",
        "on_place"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j124om4wdmpruy2")

  // remove
  collection.schema.removeField("ano6ozx2")

  return dao.saveCollection(collection)
})
