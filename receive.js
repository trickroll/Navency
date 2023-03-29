/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

const Response = require("./response"),
  GraphApi = require("./graph-api"),
  Mongo = require("./mongodb")

let topic = "Subscription";

module.exports = class Receive {
  constructor(user, webhookEvent, isUserRef) {
    this.user = user;
    this.webhookEvent = webhookEvent;
    this.isUserRef = isUserRef;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
 async handleMessage() {
    let event = this.webhookEvent;

    let responses;
    let pageID = this.webhookEvent.recipient.id  
    
    let pageAccess = await Mongo.mongoGetPageAuth(pageID)
   
    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = await this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      } else if (event.optin) {
        responses = this.handleOptIn();
      } else if (event.pass_thread_control) {
        responses = this.handlePassThreadControlHandover();
      }
    } catch (error) {
      console.error(error);
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`,
      };
    }
// console.log(responses)
    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000, this.isUserRef);
        delay++;
      }
    } else {
      this.sendMessage(responses, 0, this.isUserRef);
    }
  }



  // Handles messages events with text
handleTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid}`
    );

    let response;
    let event = this.webhookEvent;
  
    return Mongo.mongoRead("optIn", "sender")
      .then((res) => {
        if (res.includes(this.user.psid)) {
          response = Response.genText("text");
        } else {
          let requestBody = {
            sender: event["sender"]["id"],
            recipient: event["recipient"]["id"],
            message: event["message"]["text"],
            time: event["timestamp"],
            // User info; might want to remove in later versions
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            profilePic: this.user.profilePic,
          };

          Mongo.mongoWrite(requestBody, "textMessage");

          let message = event.message.text.trim().toLowerCase();

          response = Response.genRecurringNotificationsTemplate(
            `https://picsum.photos/200`,
            topic,
            "12345"
          );
        }
      // console.log(response)
        return response;
      });
  }

  // Handles postbacks events
  handlePostback() {
    let postback = this.webhookEvent.postback;
    // Check for the special Get Starded with referral
    let payload;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else if (postback.payload) {
      // Get the payload of the postback
      payload = postback.payload;
    }
    if (payload.trim().length === 0) {
      console.log("Ignore postback with empty payload");
      return null;
    }

    return this.handlePayload(payload.toUpperCase());
  }

  // Handles optins events
  handleOptIn() {
    let optin = this.webhookEvent.optin;
    let payload;
    // Opt-in types can include stopping or resuming notifications
    if (optin.notification_messages_status === "STOP_NOTIFICATIONS") {
      Mongo.mongoUpdateToken(optin.notification_messages_token, false, "optIn");
    } else if (optin.notification_messages_status === "RESUME_NOTIFICATIONS") {
      Mongo.mongoUpdateToken(optin.notification_messages_token, true, "optIn");
    } else {
      payload = "RN";

      optin["sender"] = this.webhookEvent["sender"]["id"];
      optin["recipient"] = this.webhookEvent["recipient"]["id"];
      optin["time"] = this.webhookEvent["timestamp"];
      optin["firstName"] = this.user.firstName;
      optin["lastName"] = this.user.lastName;
      optin["profilePic"] = this.user.profilePic;
      optin["active"] = true;

      let requestBody = optin;

      Mongo.mongoWrite(requestBody, "optIn");

      return this.handlePayload(payload);
    }
    return null;
  }

  // automatically creates the subscription link: `https://m.me/rn/${PAGE_ID}?topic=${topic}`

  handlePayload(payload) {
    console.log("Received Payload:", `${payload} for ${this.user.psid}`);

    let response;
    // Set the response based on the payload
    if (payload === "YES") {
      response = { text: "Thanks!" };
    } else if (payload === "RN") {
      response = Response.genGenericTemplate(
        `https://picsum.photos/200`,
        "Thank you for subscribing",
        `Use "MESSENGER10" for 10% off`,
        [Response.genWebUrlButton(`Visit Site`, "navency.com")]
        // [Response.genPostbackButton(`GET COUPON`, "COUPON_50")]
      );
    } else if (payload === "NO") {
      response = { text: "Oops, try sending another image." };
    } else if (payload === "OPTIN") {
      response = Response.genRecurringNotificationsTemplate(
        `https://picsum.photos/200`,
        topic,
        "12345"
      );
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`,
      };
    }

    return response;
  }

  sendMessage(response, delay = 0, isUserRef) {
    // Check if there is delay in the response
    if (response === undefined || response === null) {
      return;
    }
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {};
    if (isUserRef) {
      // For chat plugin
      requestBody = {
        recipient: {
          user_ref: this.user.psid,
        },
        message: response,
      };
    } else {
      console.log("send msg called");
      requestBody = {
        recipient: {
          id: this.user.psid,
        },
        message: response,
      };
    }
    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }

  sendRecurringMessage(notificationMessageToken, message, scheduledTime) {
    let requestBody = {},
      response;

    // 250 character limit and image would need to be separate message...
    response = { text: message };

    let delay = this.scheduleSend(scheduledTime);

    // Check if there is delay in the response
    if (response === undefined) {
      return;
    }
    for (let i = 0; i < notificationMessageToken.length; i++) {
      let token = notificationMessageToken[i];
      requestBody = {
        recipient: {
          notification_messages_token: token,
        },
        message: response,
      };

      // Done in order to prevent looping issues
      this.nextSend(requestBody, delay);
    }
  }

  nextSend(requestBody, delay) {
    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }

  scheduleSend(scheduledTime) {
    const [year, month, day, hour, min] = scheduledTime;
    let now = new Date();

    //   Changed to SGT or GMT+8
    let dateFromScheduledTime = new Date(year, month, day, hour - 8, min);
    console.log(`message received and to be sent at ${dateFromScheduledTime}`);
    let sendTime = dateFromScheduledTime.getTime() - now.getTime();
    return sendTime;
  }
};
