/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yw0q1wn6",
    "name": "houseNumber",
    "type": "text",
    "required": false,
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
    "id": "ckpkttmv",
    "name": "streetName",
    "type": "text",
    "required": false,
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
    "id": "ufmit1f2",
    "name": "city",
    "type": "text",
    "required": false,
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
    "id": "qi4ssn8o",
    "name": "postalCode",
    "type": "text",
    "required": false,
    "presentable": false,
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
  const collection = dao.findCollectionByNameOrId("fk4lafqifo7mo3b")

  // remove
  collection.schema.removeField("yw0q1wn6")

  // remove
  collection.schema.removeField("ckpkttmv")

  // remove
  collection.schema.removeField("ufmit1f2")

  // remove
  collection.schema.removeField("qi4ssn8o")

  return dao.saveCollection(collection)
})
