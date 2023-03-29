"use strict";

// Imports dependencies
const config = require("./config"),
  fetch = require("node-fetch"),
  MongoClient = require("mongodb").MongoClient,
  { URL, URLSearchParams } = require("url");

let connectionString =
    "mongodb+srv://leebeensg:SbQ6tS7QJahoR7Do@cluster0.qj3dtfz.mongodb.net/?retryWrites=true&w=majority",
  db,
  dbName = "message";

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  })
  .catch((error) => console.error(error));

module.exports = class Mongo {
  static async mongoWrite(requestBody, collection) {
    db.collection(collection)
      .insertOne(requestBody)
      .then((result) => {
        console.dir(`Collection ${collection} update`);
      })
      .catch((error) => console.error(error));
  }

  static async mongoUpdateToken(token, isActive, collection) {
    db.collection(collection)
      .updateOne(
        { notification_messages_token: token },
        { $set: { active: isActive } }
      )
      .then((result) => {
        console.log(`Token ${token} active is now ${isActive} in Mongo`);
      })
      .catch((error) => console.error(error));
  }

  static async mongoUpdatePageAuth(pageID, pageAccessToken) {
    db.collection("pageAuth")
      .updateOne(
        { id: pageID },
        { $set: { access_token: pageAccessToken } },
        {upsert: true}
      )
      .then((result) => {
        console.log(`PageID in Mongo`);
      })
      .catch((error) => console.error(error));
  }
  
  // static async mongoRead(collection, field) {
  //   db.collection(collection)
  //     .find().toArray()
  //     .then((result) => {
  //       let fin = []
  //       for (let i=0; i<result.length; i++){
  //        fin.push(result[i][field])
  //       }
  //       return fin
  //     })
  //     .catch((error) => console.error(error));
  // }

  static async mongoRead(collection, field) {
    return db
      .collection(collection)
      .find()
      .toArray()
      .then((result) => {
        let fin = [];
        for (let i = 0; i < result.length; i++) {
          fin.push(result[i][field]);
        }
        return fin;
      })
      .catch((error) => {
        console.error(error);
        throw error; // re-throw the error so that it can be caught elsewhere
      });
  }

};
