/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fhlxfbkx",
    "name": "exceptDeliveryMethod",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "bofyqfpk36b7nkh",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  // remove
  collection.schema.removeField("fhlxfbkx")

  return dao.saveCollection(collection)
})
