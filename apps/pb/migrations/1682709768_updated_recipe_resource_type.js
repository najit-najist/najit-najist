migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn")

  collection.name = "recipe_resource_metric"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn")

  collection.name = "recipe_resource_type"

  return dao.saveCollection(collection)
})
