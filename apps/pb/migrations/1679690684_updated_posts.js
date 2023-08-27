migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  // remove
  collection.schema.removeField("mesu0emh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fjwimuro",
    "name": "categories",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "vwxfzn18sc65gso",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": [
        "title"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fjwimuro",
    "name": "categories",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "vwxfzn18sc65gso",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": [
        "title"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
