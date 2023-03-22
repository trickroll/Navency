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
  PAGE_ID = process.env.PAGE_ID;

  let topic = "Subscription"

module.exports = class Receive {
  constructor(user, webhookEvent, isUserRef) {
    this.user = user;
    this.webhookEvent = webhookEvent;
    this.isUserRef = isUserRef;
  }

  // Check if the event is a message or postback and
  // call the appropriate handler function
  handleMessage() {
    let event = this.webhookEvent;

    let responses;

    try {
      if (event.message) {
        let message = event.message;

        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
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

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000, this.isUserRef);
        delay++;
      }
    } else {
      this.sendMessage(responses, this.isUserRef);
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    console.log(
      "Received text:",
      `${this.webhookEvent.message.text} for ${this.user.psid}`
    );

    let event = this.webhookEvent;

    let message = event.message.text.trim().toLowerCase();

    let response = Response.genRecurringNotificationsTemplate(
        `https://picsum.photos/200`,
        topic,
        "12345"
      );

    return response;
  }

//   // Handles mesage events with attachments
//   handleAttachmentMessage() {
//     let response;

//     // Get the attachment
//     let attachment = this.webhookEvent.message.attachments[0];
//     console.log("Received attachment:", `${attachment} for ${this.user.psid}`);

//     response = {
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "generic",
//           elements: [
//             {
//               title: "Is this the right picture?",
//               subtitle: "Tap a button to answer.",
//               image_url: "https://picsum.photos/200",
//               buttons: [
//                 {
//                   type: "postback",
//                   title: "Yes!",
//                   payload: "yes",
//                 },
//                 {
//                   type: "postback",
//                   title: "No!",
//                   payload: "no",
//                 },
//                 {
//                   type: "postback",
//                   title: "Opt-in",
//                   payload: "OPTIN",
//                 },
//               ],
//             },
//           ],
//         },
//       },
//     };

//     return response;
//   }

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
    // Check for the special Get Starded with referral
    let payload;
    if (optin.type === "notification_messages") {
      payload = "RN";
      this.sendRecurringMessage(optin.notification_messages_token, 5000);
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
            'Thank you for subscribing',
            `Please find 10% coupon`,
            [Response.genPostbackButton(`GET COUPON`, "COUPON_50")]
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
      requestBody = {
        recipient: {
          id: this.user.psid,
        },
        message: response,
      };
    }
    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }

  sendRecurringMessage(notificationMessageToken, delay) {
    console.log("Received Recurring Message token");
    let requestBody = {},
      response;
    // curation;
    //This example will send summer collection
    // curation = new Curation(this.user, this.webhookEvent);
    response = { text: `toke received ${notificationMessageToken}` };
    // Check if there is delay in the response
    if (response === undefined) {
      return;
    }
    requestBody = {
      recipient: {
        notification_messages_token: notificationMessageToken,
      },
      message: response,
    };

    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }
  // firstEntity(nlp, name) {
  //   return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  // }
};
