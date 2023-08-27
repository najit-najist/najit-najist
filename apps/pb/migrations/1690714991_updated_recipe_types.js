migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2ljho6yocaxpjcm")

  collection.createRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2ljho6yocaxpjcm")

  collection.createRule = null

  return dao.saveCollection(collection)
})
