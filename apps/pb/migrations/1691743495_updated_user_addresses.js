/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mzbeytne",
    "name": "municipality",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "lq3lvziphfijlro",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mzbeytne",
    "name": "municipality",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "lq3lvziphfijlro",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
