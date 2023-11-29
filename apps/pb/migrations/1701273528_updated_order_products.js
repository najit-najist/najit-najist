/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9dhjdkoigmx70sx")

  collection.listRule = "@request.auth.id != null"
  collection.viewRule = "@request.auth.id != null"
  collection.createRule = "@request.auth.id != null"
  collection.updateRule = "@request.auth.role = \"ADMIN\""
  collection.deleteRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9dhjdkoigmx70sx")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
