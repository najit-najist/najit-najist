/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0bx7xplr8p1b3zu")

  collection.listRule = "@request.auth.id != NULL"
  collection.viewRule = "@request.auth.id != NULL"
  collection.createRule = "@request.auth.id != NULL"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0bx7xplr8p1b3zu")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
