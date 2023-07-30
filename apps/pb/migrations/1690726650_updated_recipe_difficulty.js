migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  collection.createRule = "@request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  collection.createRule = null

  return dao.saveCollection(collection)
})
