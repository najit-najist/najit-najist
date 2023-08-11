/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kckzs0d16egkbj4")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_jLH3Tv7` ON `newsletter_subscriptions` (`uuid`)",
    "CREATE UNIQUE INDEX `idx_DgAzpwO` ON `newsletter_subscriptions` (`email`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kckzs0d16egkbj4")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_jLH3Tv7` ON `newsletter_subscriptions` (`uuid`)",
    "CREATE INDEX `idx_DgAzpwO` ON `newsletter_subscriptions` (`email`)"
  ]

  return dao.saveCollection(collection)
})
