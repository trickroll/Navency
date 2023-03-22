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

  // Bing's edits
  console.log("res", "response body in webhook" + res.body);
});

// // Creates the endpoint for your webhook
// app.post("/webhook", (req, res) => {
//   let body = req.body;

//   // Checks if this is an event from a page subscription
//   if (body.object === "page") {
//     // Iterates over each entry - there may be multiple if batched
//     body.entry.forEach(function (entry) {
//       // Gets the body of the webhook event
//       let webhookEvent = entry.messaging[0];
//       console.log(webhookEvent);

//       // Get the sender PSID
//       let senderPsid = webhookEvent.sender.id;
//       console.log("Sender PSID: " + senderPsid);

//       // Check if the event is a message or postback and
//       // pass the event to the appropriate handler function
//       if (webhookEvent.message) {
//         handleMessage(senderPsid, webhookEvent.message);
//       } else if (webhookEvent.postback) {
//         handlePostback(senderPsid, webhookEvent.postback);
//       }
//     });

//     // Returns a '200 OK' response to all requests
//     res.status(200).send("EVENT_RECEIVED");
//   } else {
//     // Returns a '404 Not Found' if event is not from a page subscription
//     res.sendStatus(404);
//   }
// });

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
          if (!(senderPsid in users)) {
            if (!guestUser) {
              // Make call to UserProfile API only if user is not guest
              let user = new User(senderPsid);
              GraphApi.getUserProfile(senderPsid)
                .then((userProfile) => {
                  user.setProfile(userProfile);
                })
                .catch((error) => {
                  // The profile is unavailable
                  console.log(JSON.stringify(body));
                  console.log("Profile is unavailable:", error);
                })
                .finally(() => {
                  console.log("locale: " + user.locale);
                  users[senderPsid] = user;
                  console.log(
                    "New Profile PSID:",
                    senderPsid,
                    "with locale:",
                  );
                  return receiveAndReturn(
                    users[senderPsid],
                    webhookEvent,
                    false
                  );
                });
            } else {
              setDefaultUser(senderPsid);
              return receiveAndReturn(users[senderPsid], webhookEvent, false);
            }
          } else {
            console.log(
              "Profile already exists PSID:",
              senderPsid,
              "with locale:",
            );
            return receiveAndReturn(users[senderPsid], webhookEvent, false);
          }
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

// // Handles messages events
// function handleMessage(senderPsid, receivedMessage) {
//   let response;

//   // Checks if the message contains text
//   if (receivedMessage.text) {
//     // Create the payload for a basic text message, which
//     // will be added to the body of your request to the Send API
//     response = {
//       text: `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`,
//     };
//   } else if (receivedMessage.attachments) {
//     // Get the URL of the message attachment
//     let attachmentUrl = receivedMessage.attachments[0].payload.url;
    // response = {
    //   attachment: {
    //     type: "template",
    //     payload: {
    //       template_type: "generic",
    //       elements: [
    //         {
    //           title: "Is this the right picture?",
    //           subtitle: "Tap a button to answer.",
    //           image_url: attachmentUrl,
    //           buttons: [
    //             {
    //               type: "postback",
    //               title: "Yes!",
    //               payload: "yes",
    //             },
    //             {
    //               type: "postback",
    //               title: "No!",
    //               payload: "no",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   },
    // };
//   }

//   // Send the response message
//   callSendAPI(senderPsid, response);
// }

// Handles messaging_postbacks events
// function handlePostback(senderPsid, receivedPostback) {
//   let response;

//   // Get the payload for the postback
//   let payload = receivedPostback.payload;

//   // Set the response based on the postback payload
//   if (payload === "yes") {
//     response = { text: "Thanks!" };
//   } else if (payload === "no") {
//     response = { text: "Oops, try sending another image." };
//   }
//   // Send the message to acknowledge the postback
//   callSendAPI(senderPsid, response);
// }

// // Sends response messages via the Send API
// function callSendAPI(senderPsid, response) {
//   // The page access token we have generated in your app settings
//   const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

//   // Construct the message body
//   let requestBody = {
//     recipient: {
//       id: senderPsid,
//     },
//     message: response,
//   };

//   // Send the HTTP request to the Messenger Platform
//   request(
//     {
//       uri: "https://graph.facebook.com/v2.6/me/messages",
//       qs: { access_token: PAGE_ACCESS_TOKEN },
//       method: "POST",
//       json: requestBody,
//     },
//     (err, _res, _body) => {
//       if (!err) {
//         console.log("Message sent!");
//       } else {
//         console.error("Unable to send message:" + err);
//       }
//     }
//   );
// }

// Sends response messages via the Send API
function sendBroadcast(senderPsid, response) {
  // The page access token we have generated in your app settings
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  // Construct the message body
  let requestBody = {
    recipient: {
      notification_messages_token: "8183222379117308817", //this is the opt-in token id
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "First msg!",
              image_url: "https://picsum.photos/200",
              subtitle: "We have the right hat for everyone.",
              default_action: {
                type: "web_url",
                url: "https://www.originalcoastclothing.com/",
                webview_height_ratio: "tall",
              },
              buttons: [
                {
                  type: "web_url",
                  url: "https://www.navency.com/",
                  title: "Check it out Website",
                },
                {
                  type: "postback",
                  title: "Start Chatting",
                  payload: "ADDITIONAL-WEBHOOK-INFORMATION",
                },
              ],
            },
          ],
        },
      },
    },
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v16.0/106030262429449/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: requestBody,
    },
    (err, _res, _body) => {
      if (!err) {
        console.log("Broadcast message sent!");
      } else {
        console.error("Unable to send broadcast message:" + err);
      }
    }
  );
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// const url = `https://graph.facebook.com/${API_VERSION_NUMBER}/${PAGE_ID}/notification_message_tokens`;

// const options = {
//   method: 'GET',
//   url: url,
//   qs: {
//     access_token: PAGE_ACCESS_TOKEN,
//   },
// };

// request(options, (error, response, body) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log(body);
//   }
// });
