/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  collection.listRule = "@request.auth.id != NULL"
  collection.viewRule = "@request.auth.id != NULL"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
