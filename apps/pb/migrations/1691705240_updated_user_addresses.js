migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  collection.createRule = "@request.auth.collectionName = \"api_controllers\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  collection.createRule = null

  return dao.saveCollection(collection)
})
