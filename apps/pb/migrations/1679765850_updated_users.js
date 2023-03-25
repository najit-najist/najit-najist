migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wtqrvuak",
    "name": "likedRecipes",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "5upb6wjdha0povx",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("wtqrvuak")

  return dao.saveCollection(collection)
})
