/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger Platform Quick Start Tutorial
 *
 * This is the completed code for the Messenger Platform quick start tutorial
 *
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 *
 */

"use strict";

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  { urlencoded, json } = require("body-parser"),
  Receive = require("./receive"),
  User = require("./user"),
  GraphApi = require("./graph-api"),
  GraphApiNew = require("./graph-api-new"),
  Mongo = require("./mongodb"),
  app = express();

let users = {};

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// Parse application/json
app.use(json());

// Respond with website when a GET request is made to the homepage
app.get("/", function (_req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Adds support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Create the endpoint for your webhook
app.post("/webhook", (req, res) => {
  let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  // Check if this is an event from a page subscription
  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(async function (entry) {
      if ("changes" in entry) {
        // Handle Page Changes event
        let receiveMessage = new Receive();
        if (entry.changes[0].field === "feed") {
          let change = entry.changes[0].value;
          switch (change.item) {
            case "post":
              return receiveMessage.handlePrivateReply(
                "post_id",
                change.post_id
              );
            case "comment":
              return receiveMessage.handlePrivateReply(
                "comment_id",
                change.comment_id
              );
            default:
              console.warn("Unsupported feed change type.");
              return;
          }
        }
      }

      // Iterate over webhook events - there may be multiple
      entry.messaging.forEach(async function (webhookEvent) {
        // Discard uninteresting events
        if ("read" in webhookEvent) {
          console.log("Got a read event");

          let requestBody = {
            sender: webhookEvent["sender"]["id"],
            recipient: webhookEvent["recipient"]["id"],
            watermark: webhookEvent["read"]["watermark"],
            event: "read",
          };
          Mongo.mongoWrite(requestBody, "messageReads");

          return;
        } else if ("delivery" in webhookEvent) {
          console.log("Got a delivery event");

          let requestBody = {
            sender: webhookEvent["sender"]["id"],
            recipient: webhookEvent["recipient"]["id"],
            watermark: webhookEvent["delivery"]["watermark"],
            event: "deliveries",
          };
          Mongo.mongoWrite(requestBody, "messageDeliveries");

          return;
        } else if (webhookEvent.message && webhookEvent.message.is_echo) {
          console.log(
            "Got an echo of our send, mid = " + webhookEvent.message.mid
          );
          return;
        }

        //         Get access token

        let pageAccesToken = await Mongo.mongoGetPageAuth(
          webhookEvent["recipient"]["id"]
        );

        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;

        let user = new User(senderPsid);
        let graph = new GraphApiNew(pageAccesToken);
        graph
          .getUserProfile(senderPsid)
          .then((userProfile) => {
            user.setProfile(userProfile);
            // console.dir(userProfile)
          })
          .catch((error) => {
            // The profile is unavailable
            console.log(JSON.stringify(body));
            console.log("Profile is unavailable:", error);
          })
          .finally(() => {
            users[senderPsid] = user;
            // console.log("New Profile PSID:", senderPsid);

            return receiveAndReturn(
              users[senderPsid],
              webhookEvent,
              false,
              pageAccesToken
            );
          });
      });
    });
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

app.post("/broadcast", (req, res) => {
  let receiveMessage;
  req.body.notificationMessageToken.forEach((token) => {
    getPageAccessFromNotif(token);
  });

  async function getPageAccessFromNotif(notificationMessageToken) {
    let recipient = await Mongo.mongoGetRecipient(notificationMessageToken);
    let pageAccesToken = await Mongo.mongoGetAccess(recipient);
    receiveMessage = new Receive('','','', pageAccesToken);
    receiveMessage.sendRecurringMessage(
      req.body.notificationMessageToken,
      req.body.message,
      req.body.sendTime
    );
  }

  res.send(req.body);
});

app.post("/oauth", (req, res) => {
  const data = req.body; // retrieve the data from the request body
  console.dir(data);
  getLongTermPageAccess(data)
  
  async function getLongTermPageAccess(data){
    let longTermUser = await GraphApiNew.changeUserLongTerm(data.user.accessToken)
    let longTermPage = await GraphApiNew.changePageLongTerm(data.user.userID, longTermUser.access_token)
    let pageAuth = longTermPage.data
    
    pageAuth.forEach((page) => {
      Mongo.mongoUpdatePageAuth(page.id, page);
      // GraphApiNew.createGetStarted(data.user.userID, page.access_token)
    })
    
  }
  
  console.log("Success");
  res.sendStatus(200); // send a success response
});

// app.post("/oauth", (req, res) => {
//   const data = req.body; // retrieve the data from the request body
//   console.dir(data);
//   data.data.forEach(async function (page) {
//     Mongo.mongoUpdatePageAuth(page.id, page);
//     GraphApiNew.callChangeSubscriptonAPI(page.id, page.access_token);
//   });

//   console.log("Success");
//   res.sendStatus(200); // send a success response
// });

function setDefaultUser(id) {
  let user = new User(id);
  users[id] = user;
}

function receiveAndReturn(user, webhookEvent, isUserRef, pageAccesToken) {
  let receiveMessage = new Receive(
    user,
    webhookEvent,
    isUserRef,
    pageAccesToken
  );
  return receiveMessage.handleMessage();
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
