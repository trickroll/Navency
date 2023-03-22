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
  app = express();


let users = {};

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// Parse application/json
app.use(json());

// Respond with 'Hello World' when a GET request is made to the homepage
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
          return;
        } else if ("delivery" in webhookEvent) {
          console.log("Got a delivery event");
          return;
        } else if (webhookEvent.message && webhookEvent.message.is_echo) {
          console.log(
            "Got an echo of our send, mid = " + webhookEvent.message.mid
          );
          return;
        }

        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
          // Get the user_ref if from Chat plugin logged in user
        let user_ref = webhookEvent.sender.user_ref;
        // Check if user is guest from Chat plugin guest user
        let guestUser = isGuestUser(webhookEvent);

        if (senderPsid != null && senderPsid != undefined) {
              
          setDefaultUser(senderPsid);
          return receiveAndReturn(users[senderPsid], webhookEvent, false);    
          
          // if (!(senderPsid in users)) {
          //   if (!guestUser) {
          //     // Make call to UserProfile API only if user is not guest
          //     let user = new User(senderPsid);
          //     GraphApi.getUserProfile(senderPsid)
          //       .then((userProfile) => {
          //         user.setProfile(userProfile);
          //       })
          //       .catch((error) => {
          //         // The profile is unavailable
          //         console.log(JSON.stringify(body));
          //         console.log("Profile is unavailable:", error);
          //       })
          //       .finally(() => {
          //         console.log("locale: " + user.locale);
          //         users[senderPsid] = user;
          //         console.log(
          //           "New Profile PSID:",
          //           senderPsid,
          //           "with locale:",
          //         );
          //         return receiveAndReturn(
          //           users[senderPsid],
          //           webhookEvent,
          //           false
          //         );
          //       });
          //   } else {
          //     setDefaultUser(senderPsid);
          //     return receiveAndReturn(users[senderPsid], webhookEvent, false);
          //   }
          // } else {
          //   console.log(
          //     "Profile already exists PSID:",
          //     senderPsid,
          //     "with locale:",
          //   );
          //   return receiveAndReturn(users[senderPsid], webhookEvent, false);
          // }
        } else if (user_ref != null && user_ref != undefined) {
          // Handle user_ref
          setDefaultUser(user_ref);
          return receiveAndReturn(users[user_ref], webhookEvent, true);
        }
      });
    });
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

function setDefaultUser(id) {
  let user = new User(id);
  users[id] = user;
}

function isGuestUser(webhookEvent) {
  let guestUser = false;
  if ("postback" in webhookEvent) {
    if ("referral" in webhookEvent.postback) {
      if ("is_guest_user" in webhookEvent.postback.referral) {
        guestUser = true;
      }
    }
  }
  return guestUser;
}

function receiveAndReturn(user, webhookEvent, isUserRef) {
  let receiveMessage = new Receive(user, webhookEvent, isUserRef);
  return receiveMessage.handleMessage();
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});


