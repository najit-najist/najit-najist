migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5i8sf5ss",
    "name": "color",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fnbbqjrf",
    "name": "name",
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
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  // remove
  collection.schema.removeField("5i8sf5ss")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fnbbqjrf",
    "name": "name",
    "type": "text",
    "required": false,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
