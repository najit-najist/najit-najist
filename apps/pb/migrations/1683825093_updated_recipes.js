migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  collection.updateRule = "@request.auth.role = \"ADMIN\""
  collection.indexes = [
    "CREATE INDEX `_5upb6wjdha0povx_created_idx` ON `recipes` (`created`)",
    "CREATE UNIQUE INDEX `idx_unique_bwffmuio` ON `recipes` (`title`)",
    "CREATE UNIQUE INDEX `idx_unique_6ofvaiqe` ON `recipes` (`slug`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bwffmuio",
    "name": "title",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6ofvaiqe",
    "name": "slug",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5upb6wjdha0povx")

  collection.updateRule = null
  collection.indexes = [
    "CREATE INDEX `_5upb6wjdha0povx_created_idx` ON `recipes` (`created`)",
    "CREATE UNIQUE INDEX \"idx_unique_bwffmuio\" on \"recipes\" (\"title\")",
    "CREATE UNIQUE INDEX \"idx_unique_6ofvaiqe\" on \"recipes\" (\"slug\")"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bwffmuio",
    "name": "title",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6ofvaiqe",
    "name": "slug",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
