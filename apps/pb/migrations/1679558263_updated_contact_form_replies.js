migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("y5pp5g4r569dalh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ydyfvgbm",
    "name": "telephone",
    "type": "text",
    "required": false,
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
  const collection = dao.findCollectionByNameOrId("y5pp5g4r569dalh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ydyfvgbm",
    "name": "telephone",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
