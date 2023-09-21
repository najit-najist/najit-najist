/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  collection.listRule = "@request.auth.role = \"ADMIN\" || publishedAt != NULL"
  collection.viewRule = "@request.auth.role = \"ADMIN\" || publishedAt != NULL"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ts0cq43ojr833ru")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
