migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6ofvaiqe",
    "name": "slug",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  // remove
  collection.schema.removeField("6ofvaiqe")

  return dao.saveCollection(collection)
})
