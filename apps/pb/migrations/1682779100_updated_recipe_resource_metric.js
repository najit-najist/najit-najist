migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
