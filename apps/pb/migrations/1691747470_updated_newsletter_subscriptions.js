/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kckzs0d16egkbj4")

  collection.viewRule = "@request.auth.collectionName = \"api_controllers\""
  collection.createRule = "@request.auth.collectionName = \"api_controllers\""
  collection.updateRule = "@request.auth.collectionName = \"api_controllers\""
  collection.deleteRule = "@request.auth.collectionName = \"api_controllers\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kckzs0d16egkbj4")

  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
