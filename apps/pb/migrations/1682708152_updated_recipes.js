migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  // remove
  collection.schema.removeField("caisx7zp")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "caisx7zp",
    "name": "timeLength",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
