/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bofyqfpk36b7nkh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wootc5af",
    "name": "slug",
    "type": "text",
    "required": true,
    "presentable": false,
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
  const collection = dao.findCollectionByNameOrId("bofyqfpk36b7nkh")

  // remove
  collection.schema.removeField("wootc5af")

  return dao.saveCollection(collection)
})
