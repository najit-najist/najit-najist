/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = "@request.auth.role = \"ADMIN\""
  collection.updateRule = "@request.auth.role = \"ADMIN\""
  collection.deleteRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
