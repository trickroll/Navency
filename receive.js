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
  GraphApiNew = require("./graph-api-new"),
  Mongo = require("./mongodb");

module.exports = class Receive {
  constructor(user, webhookEvent, isUserRef, pageAccesToken) {
    this.user = user;
    this.webhookEvent = webhookEvent;
    this.isUserRef = isUserRef;
    this.pageAccesToken = pageAccesToken;
  }
  // Check if the event is a message or postback and
  // call the appropriate handler function
  async handleMessage() {
    let event = this.webhookEvent;

    let responses;
    let pageID = this.webhookEvent.recipient.id;

    // this.pageAccesToken = await Mongo.mongoGetPageAuth(pageID)
    console.log("handlemsg called")
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
        responses = await this.handlePostback();
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

    response = Response.genText("No Mong")

      return response;

    // return Mongo.mongoCheckOptin(event["recipient"]["id"]).then((res) => {
    //   if (res.includes(this.user.psid)) {
    //     response = Response.genText("text");
    //   } else {
    //     let requestBody = {
    //       sender: event["sender"]["id"],
    //       recipient: event["recipient"]["id"],
    //       message: event["message"]["text"],
    //       time: event["timestamp"],
    //       // User info; might want to remove in later versions
    //       firstName: this.user.firstName,
    //       lastName: this.user.lastName,
    //       profilePic: this.user.profilePic,
    //     };

    //     Mongo.mongoWrite(requestBody, "textMessage");

    //     let message = event.message.text.trim().toLowerCase();

    //     response = Response.genRecurringNotificationsTemplate(
    //       `https://picsum.photos/200`,
    //       "Subscribe",
    //       event["recipient"]["id"]
    //     );
    //   }
    //   return response;
    // });
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
    if (payload === "RN") {
      response = Response.genText("Thank you! Subscription confirmed");
    } else if (payload === "GET_STARTED") {
      response = Response.genRecurringNotificationsTemplate(
        `https://picsum.photos/200`,
        "Subscribe",
        this.webhookEvent["recipient"]["id"]
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

    let graph = new GraphApiNew(this.pageAccesToken);
    setTimeout(() => graph.callSendApiInstance(requestBody), delay);
  }

  sendRecurringMessage(
    notificationMessageToken,
    message,
    scheduledTime,
    imgURL
  ) {
    let requestBodyTxt,
      requestBodyImg = {},
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
      requestBodyTxt = {
        recipient: {
          notification_messages_token: token,
        },
        message: response,
      };

      requestBodyImg = {
        recipient: {
          notification_messages_token: token,
        },
        message: {
          attachment: {
            type: "image",
            payload: {
              url: imgURL,
              is_reusable: true,
            },
          },
        },
      };

      // Done in order to prevent looping issues
      this.nextSend(requestBodyTxt, requestBodyImg, delay);
    }
  }

  nextSend(requestBodyTxt, requestBodyImg, delay) {
    let graph = new GraphApiNew(this.pageAccesToken);
    setTimeout(async () => {
      await graph.callSendApiInstance(requestBodyImg);
      graph.callSendApiInstance(requestBodyTxt);
    }, delay);
    // setTimeout(() => graph.callSendApiInstance(requestBody), delay);
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
