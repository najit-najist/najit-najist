/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f94c9ngyuuyj2v")

  collection.listRule = "user = @request.auth.id || @request.auth.role = \"ADMIN\""
  collection.viewRule = "user = @request.auth.id || @request.auth.role = \"ADMIN\""
  collection.updateRule = "user = @request.auth.id || @request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3f94c9ngyuuyj2v")

  collection.listRule = null
  collection.viewRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
