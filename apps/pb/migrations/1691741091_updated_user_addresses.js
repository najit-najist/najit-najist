migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  collection.listRule = "@collection.users.address.id = id"
  collection.viewRule = "@collection.users.address.id = id"
  collection.updateRule = "@collection.users.address.id = id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  collection.listRule = null
  collection.viewRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
