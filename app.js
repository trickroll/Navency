/**
 * https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
 *
 */

"use strict";

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  path = require("path"),
  { urlencoded, json } = require("body-parser"),
  Receive = require("./receive"),
  User = require("./user"),
  GraphApiNew = require("./graph-api-new"),
  // Mongo = require("./mongodb"),
  app = express();
// MongoClient= require('mongodb').MongoClient;

let users = {};

// For Cyclic Mongodb
// const uri = process.env.MONGO_CONNECTION_STRING
// const client = new MongoClient(uri)

// const connectDB = async () => {
//   try {
//     const conn = await MongoClient.connect(process.env.MONGO_CONNECTION_STRING, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//       useCreateIndex: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// Parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// Serving static files in Express
app.use(express.static(path.join(path.resolve(), "public")));

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

    console.log("***********************");
    console.log("move into messaging loops");
    // Iterate over webhook events - there may be multiple

    for (const webhookEntry of body.entry) {
      let webhookEvent = webhookEntry.messaging[0]
      // Discard uninteresting events
      if ("read" in webhookEvent) {
        console.log("Got a read event");

        let requestBody = {
          sender: webhookEvent["sender"]["id"],
          recipient: webhookEvent["recipient"]["id"],
          watermark: webhookEvent["read"]["watermark"],
          event: "read",
        };
        // Mongo.mongoUpdateMessage(requestBody, "messageReads");

        return;
      } else if ("delivery" in webhookEvent) {
        console.log("Got a delivery event");

        let requestBody = {
          sender: webhookEvent["sender"]["id"],
          recipient: webhookEvent["recipient"]["id"],
          watermark: webhookEvent["delivery"]["watermark"],
          event: "deliveries",
        };
        // Mongo.mongoUpdateMessage(requestBody, "messageDeliveries");

        return;
      } else if (webhookEvent.message && webhookEvent.message.is_echo) {
        console.log(
          "Got an echo of our send, mid = " + webhookEvent.message.mid
        );
        return;
      }

      //         Get access token

      // let pageAccesToken = await Mongo.mongoGetPageAuth(
      //   webhookEvent["recipient"]["id"]
      // );

      let pageAccesToken =
        "EAADKDK5b3jMBAEzfXpucj8ZAVRYFxMgtjfozPlwKdVy5YYD2KYqZBJ1nNgLtWVzKEiHqxorMqHRjZBGW7RKjn5h9vSWmZCtdCutFZAUqMHI610Q5IKO6cwutlbHskZASKbsYUqxwlipRskvQIOUm6hmYsEUmay1GcZBPckUqjNUJFKAw0QsliFq";

      // Get the sender PSID
      let senderPsid = webhookEvent.sender.id;
      console.log("***********************");
      console.log(`moving onto finding ${senderPsid}`);
      let user = new User(senderPsid);
      console.log("***********************");
      console.log(`finished creating user class`);
      let graph = new GraphApiNew(pageAccesToken);
      console.log("***********************");
      console.log(`finished creating graph class`);
      graph
        .getUserProfile(senderPsid)
        .then((userProfile) => {
          user.setProfile(userProfile);
          console.log("***********************");
          console.dir(userProfile)
        })
        .catch((error) => {
          // The profile is unavailable
          console.log(JSON.stringify(body));
          console.log("Profile is unavailable:", error);
        })
        .finally(() => {
          users[senderPsid] = user;
          // console.log("New Profile PSID:", senderPsid);
          console.log("***********************");
          console.log("about to call receiveAndReturn");
          return receiveAndReturn(
            users[senderPsid],
            webhookEvent,
            false,
            pageAccesToken
          );
        });
    }
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
    receiveMessage = new Receive("", "", "", pageAccesToken);
    receiveMessage.sendRecurringMessage(
      req.body.notificationMessageToken,
      req.body.message,
      req.body.sendTime,
      req.body.imgURL
    );
  }

  res.send(req.body);
});

app.post("/oauth", (req, res) => {
  const data = req.body; // retrieve the data from the request body
  console.dir(data);
  getLongTermPageAccess(data);

  async function getLongTermPageAccess(data) {
    let longTermUser = await GraphApiNew.changeUserLongTerm(
      data.user.accessToken
    );
    let longTermPage = await GraphApiNew.changePageLongTerm(
      data.user.userID,
      longTermUser.access_token
    );
    let pageAuth = longTermPage.data;

    pageAuth.forEach((page) => {
      Mongo.mongoUpdatePageAuth(page.id, page);
      // GraphApiNew.createGetStarted(data.user.userID, page.access_token)
    });
  }

  console.log("Success");
  res.sendStatus(200); // send a success response
});

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

//Connect To Database
// connectDB().then(() => {
//   //Server Running
//   app.listen(process.env.PORT, () => {
//     console.log(
//       `Server is running on ${process.env.PORT}, you better catch it!`
//     );
//   });});

// client.connect(err => {
//   if(err){ console.error(err); return false;}
//   // connection to mongo is successful, listen for requests
//   app.listen(process.env.PORT, () => {
//       console.log("listening for requests");
//   })
// });

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
