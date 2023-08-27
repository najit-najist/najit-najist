/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sopozolrryx4wn1")

  collection.listRule = "@request.auth.collectionName = \"api_controllers\""
  collection.viewRule = "@request.auth.collectionName = \"api_controllers\""
  collection.createRule = "@request.auth.collectionName = \"api_controllers\""
  collection.updateRule = "@request.auth.collectionName = \"api_controllers\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sopozolrryx4wn1")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
