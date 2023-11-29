/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8y4b2zzmzjsdfr6")

  collection.listRule = "user = @request.auth.id || @request.auth.role = \"ADMIN\""
  collection.viewRule = "user = @request.auth.id || @request.auth.role = \"ADMIN\""
  collection.createRule = "@request.auth.id != null"
  collection.updateRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("8y4b2zzmzjsdfr6")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
