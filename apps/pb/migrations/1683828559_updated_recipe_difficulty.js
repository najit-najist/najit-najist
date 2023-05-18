migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  collection.updateRule = "@request.auth.role = \"ADMIN\""
  collection.indexes = [
    "CREATE INDEX `_vv59w4mb4njh8v5_created_idx` ON `recipe_difficulty` (`created`)",
    "CREATE UNIQUE INDEX `idx_unique_fnbbqjrf` ON `recipe_difficulty` (`name`)",
    "CREATE UNIQUE INDEX `idx_unique_5i8sf5ss` ON `recipe_difficulty` (`color`)",
    "CREATE UNIQUE INDEX `idx_unique_reeezzga` ON `recipe_difficulty` (`slug`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fnbbqjrf",
    "name": "name",
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
    "id": "5i8sf5ss",
    "name": "color",
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
    "id": "reeezzga",
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
  const collection = dao.findCollectionByNameOrId("vv59w4mb4njh8v5")

  collection.updateRule = null
  collection.indexes = [
    "CREATE INDEX `_vv59w4mb4njh8v5_created_idx` ON `recipe_difficulty` (`created`)",
    "CREATE UNIQUE INDEX \"idx_unique_fnbbqjrf\" on \"recipe_difficulty\" (\"name\")",
    "CREATE UNIQUE INDEX \"idx_unique_5i8sf5ss\" on \"recipe_difficulty\" (\"color\")",
    "CREATE UNIQUE INDEX \"idx_unique_reeezzga\" on \"recipe_difficulty\" (\"slug\")"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fnbbqjrf",
    "name": "name",
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
    "id": "5i8sf5ss",
    "name": "color",
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
    "id": "reeezzga",
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
