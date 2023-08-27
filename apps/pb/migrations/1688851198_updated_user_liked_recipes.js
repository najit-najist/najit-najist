migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nqxc8xr73z0bh58")

  collection.listRule = "@request.auth.id = likedBy.id"
  collection.viewRule = "@request.auth.id = likedBy.id"
  collection.createRule = "@request.auth.id != null"
  collection.updateRule = ""
  collection.deleteRule = "@request.auth.id = likedBy.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nqxc8xr73z0bh58")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
