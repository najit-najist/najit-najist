migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  collection.listRule = null
  collection.viewRule = "@request.auth.role = \"ADMIN\""
  collection.createRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  collection.listRule = ""
  collection.viewRule = null
  collection.createRule = ""

  return dao.saveCollection(collection)
})
