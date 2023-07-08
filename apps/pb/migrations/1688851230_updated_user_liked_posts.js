migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jhp91276y58sw5g")

  collection.listRule = "@request.auth.id = likedBy.id"
  collection.viewRule = "@request.auth.id = likedBy.id"
  collection.createRule = "@request.auth.id != null"
  collection.deleteRule = "@request.auth.id = likedBy.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jhp91276y58sw5g")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
