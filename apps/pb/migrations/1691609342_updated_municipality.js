migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lq3lvziphfijlro")

  collection.indexes = [
    "CREATE INDEX `idx_1bWWXAv` ON `municipality` (`name`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lq3lvziphfijlro")

  collection.indexes = []

  return dao.saveCollection(collection)
})
