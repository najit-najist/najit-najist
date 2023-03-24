migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  // remove
  collection.schema.removeField("olhwc6va")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "l6cihlod",
    "name": "description",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mesu0emh",
    "name": "field",
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
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "olhwc6va",
    "name": "description",
    "type": "editor",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("l6cihlod")

  // remove
  collection.schema.removeField("mesu0emh")

  return dao.saveCollection(collection)
})
