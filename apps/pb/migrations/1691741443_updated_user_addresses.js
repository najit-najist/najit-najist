migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  collection.listRule = "@request.auth.id = owner"
  collection.viewRule = "@request.auth.id = owner"
  collection.updateRule = "@request.auth.id = owner"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_vuskgvH` ON `user_addresses` (`owner`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lxpib8kf",
    "name": "owner",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  collection.listRule = null
  collection.viewRule = null
  collection.updateRule = null
  collection.indexes = []

  // remove
  collection.schema.removeField("lxpib8kf")

  return dao.saveCollection(collection)
})
