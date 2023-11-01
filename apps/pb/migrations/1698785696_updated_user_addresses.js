/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  collection.listRule = "@request.auth.id = owner || @request.auth.role = \"ADMIN\""
  collection.viewRule = "@request.auth.id = owner || @request.auth.role = \"ADMIN\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  collection.listRule = "@request.auth.id = owner"
  collection.viewRule = "@request.auth.id = owner"

  return dao.saveCollection(collection)
})
