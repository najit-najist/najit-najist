migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gy6qi1kq",
    "name": "type",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "2ljho6yocaxpjcm",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nroskuzb",
    "name": "resources",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rsw6zj4f",
    "name": "steps",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  // remove
  collection.schema.removeField("gy6qi1kq")

  // remove
  collection.schema.removeField("nroskuzb")

  // remove
  collection.schema.removeField("rsw6zj4f")

  // remove
  collection.schema.removeField("caisx7zp")

  return dao.saveCollection(collection)
})
