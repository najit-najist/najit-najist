migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wx2mk91p",
    "name": "numberOfPortions",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i56tab6f",
    "name": "difficulty",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "vv59w4mb4njh8v5",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  // remove
  collection.schema.removeField("wx2mk91p")

  // remove
  collection.schema.removeField("i56tab6f")

  return dao.saveCollection(collection)
})
