migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  // remove
  collection.schema.removeField("5btra0tr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "acwigxt1",
    "name": "content",
    "type": "json",
    "required": true,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5btra0tr",
    "name": "content",
    "type": "editor",
    "required": true,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("acwigxt1")

  return dao.saveCollection(collection)
})
