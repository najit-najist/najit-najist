/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bofyqfpk36b7nkh")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_b5I8FQL` ON `order_delivery_methods` (`slug`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bofyqfpk36b7nkh")

  collection.indexes = []

  return dao.saveCollection(collection)
})
