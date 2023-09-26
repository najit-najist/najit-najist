/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0cfkj77d",
    "name": "categories",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "ftw6973jcj4rgvg",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  // remove
  collection.schema.removeField("0cfkj77d")

  return dao.saveCollection(collection)
})
