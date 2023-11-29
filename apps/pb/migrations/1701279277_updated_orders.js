/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gfme52i6ojp8r4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0xqyvevi",
    "name": "email",
    "type": "email",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": [],
      "onlyDomains": []
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "afqyfgrw",
    "name": "telephoneNumber",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ec5byuyp",
    "name": "firstName",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sxuahpvm",
    "name": "lastName",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "viegxyn7",
    "name": "payment_method",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "j124om4wdmpruy2",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9gfme52i6ojp8r4")

  // remove
  collection.schema.removeField("0xqyvevi")

  // remove
  collection.schema.removeField("afqyfgrw")

  // remove
  collection.schema.removeField("ec5byuyp")

  // remove
  collection.schema.removeField("sxuahpvm")

  // remove
  collection.schema.removeField("viegxyn7")

  return dao.saveCollection(collection)
})
