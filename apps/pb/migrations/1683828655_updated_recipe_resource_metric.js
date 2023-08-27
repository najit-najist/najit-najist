migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn")

  collection.updateRule = "@request.auth.role = \"ADMIN\""
  collection.indexes = [
    "CREATE INDEX `_bbaa9o2kzz8pwtn_created_idx` ON `recipe_resource_metric` (`created`)",
    "CREATE UNIQUE INDEX `idx_unique_ppy2p44c` ON `recipe_resource_metric` (`name`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ppy2p44c",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bbaa9o2kzz8pwtn")

  collection.updateRule = null
  collection.indexes = [
    "CREATE INDEX `_bbaa9o2kzz8pwtn_created_idx` ON \"recipe_resource_metric\" (`created`)",
    "CREATE UNIQUE INDEX \"idx_unique_ppy2p44c\" on \"recipe_resource_metric\" (\"name\")"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ppy2p44c",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": 1,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
