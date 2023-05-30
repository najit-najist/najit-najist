migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  collection.createRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  collection.createRule = null

  return dao.saveCollection(collection)
})
