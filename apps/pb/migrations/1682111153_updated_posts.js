migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  collection.updateRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
