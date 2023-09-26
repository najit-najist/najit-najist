/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  collection.listRule = "publishedAt != NULL"
  collection.indexes = [
    "CREATE INDEX `_cbv7ymiczsfde5v_created_idx` ON `posts` (`created`)",
    "CREATE UNIQUE INDEX `idx_unique_iczky3e3` ON `posts` (`title`)",
    "CREATE UNIQUE INDEX `idx_unique_l7xwkjnu` ON `posts` (`slug`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iczky3e3",
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
    "id": "l7xwkjnu",
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
  const collection = dao.findCollectionByNameOrId("cbv7ymiczsfde5v")

  collection.listRule = null
  collection.indexes = [
    "CREATE INDEX `_cbv7ymiczsfde5v_created_idx` ON `posts` (`created`)",
    "CREATE UNIQUE INDEX \"idx_unique_iczky3e3\" on \"posts\" (\"title\")",
    "CREATE UNIQUE INDEX \"idx_unique_l7xwkjnu\" on \"posts\" (\"slug\")"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "iczky3e3",
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
    "id": "l7xwkjnu",
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
