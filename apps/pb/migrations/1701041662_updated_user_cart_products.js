/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m5fufxozoyqxrx7")

  collection.deleteRule = "cart.user.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("m5fufxozoyqxrx7")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
