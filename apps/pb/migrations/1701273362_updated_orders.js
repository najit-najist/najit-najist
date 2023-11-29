/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gfme52i6ojp8r4")

  collection.updateRule = "@request.auth.role = \"ADMIN\""
  collection.deleteRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gfme52i6ojp8r4")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
