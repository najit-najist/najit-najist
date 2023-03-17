migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("y5pp5g4r569dalh")

  collection.createRule = "@request.auth.email = \"info@najitnajist.cz\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("y5pp5g4r569dalh")

  collection.createRule = null

  return dao.saveCollection(collection)
})
