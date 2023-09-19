/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("419qoh29l0vzxn3")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_XNdRReU` ON `product_prices` (`product`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("419qoh29l0vzxn3")

  collection.indexes = []

  return dao.saveCollection(collection)
})
