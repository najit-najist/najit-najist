/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gfme52i6ojp8r4")

  collection.listRule = "@request.auth.id = user.id"
  collection.viewRule = "@request.auth.id = user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gfme52i6ojp8r4")

  collection.listRule = "@request.auth.id != null"
  collection.viewRule = "@request.auth.id != null"

  return dao.saveCollection(collection)
})
