/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("j124om4wdmpruy2")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uhppgr58",
    "name": "except_delivery_methods",
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
  const collection = dao.findCollectionByNameOrId("j124om4wdmpruy2")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uhppgr58",
    "name": "delivery_method",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "bofyqfpk36b7nkh",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
