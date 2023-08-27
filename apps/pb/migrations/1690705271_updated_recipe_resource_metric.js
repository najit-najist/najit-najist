migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn")

  collection.createRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn")

  collection.createRule = null

  return dao.saveCollection(collection)
})
