migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
