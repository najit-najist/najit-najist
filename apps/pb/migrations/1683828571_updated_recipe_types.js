migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2ljho6yocaxpjcm")

  collection.updateRule = "@request.auth.role = \"ADMIN\""
  collection.indexes = [
    "CREATE INDEX `_2ljho6yocaxpjcm_created_idx` ON `recipe_types` (`created`)",
    "CREATE UNIQUE INDEX `idx_unique_gnbkgscz` ON `recipe_types` (`title`)",
    "CREATE UNIQUE INDEX `idx_unique_854uoi7w` ON `recipe_types` (`slug`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gnbkgscz",
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
    "id": "854uoi7w",
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
  const collection = dao.findCollectionByNameOrId("2ljho6yocaxpjcm")

  collection.updateRule = null
  collection.indexes = [
    "CREATE INDEX `_2ljho6yocaxpjcm_created_idx` ON `recipe_types` (`created`)",
    "CREATE UNIQUE INDEX \"idx_unique_gnbkgscz\" on \"recipe_types\" (\"title\")",
    "CREATE UNIQUE INDEX \"idx_unique_854uoi7w\" on \"recipe_types\" (\"slug\")"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gnbkgscz",
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
    "id": "854uoi7w",
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
