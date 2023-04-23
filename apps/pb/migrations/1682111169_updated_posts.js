migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  collection.createRule = "@request.auth.role = \"ADMIN\""
  collection.deleteRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  collection.createRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
