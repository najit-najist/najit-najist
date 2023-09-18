/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.listRule = "id = @request.auth.id || @request.auth.collectionName = \"api_controllers\" || @request.auth.role = \"ADMIN\""
  collection.viewRule = "id = @request.auth.id || @request.auth.role = \"ADMIN\""
  collection.createRule = "@request.auth.role = \"ADMIN\""
  collection.updateRule = "id = @request.auth.id || @request.auth.role = \"ADMIN\""
  collection.deleteRule = "id = @request.auth.id || @request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
