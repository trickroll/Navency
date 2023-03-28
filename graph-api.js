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

// Imports dependencies
const config = require("./config"),
  fetch = require("node-fetch"),
  { URL, URLSearchParams } = require("url");

module.exports = class GraphApi {
  static async callSendApi(requestBody) {
    let url = new URL(`${config.apiUrl}/me/messages`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
    });
    console.warn("Request body is\n" + JSON.stringify(requestBody));
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      console.warn(
        `Unable to call Send API: ${response.statusText}`,
        await response.json()
      );
    }
  }

  static async callChangeSubscriptonAPI(pageID, pageAccess) {
    // Send the HTTP request to the Messenger Profile API

    console.log(`Updating subscription for ${pageID}`);
    let url = new URL(`${config.apiUrl}/${pageID}/subscribed_app`);
    url.search = new URLSearchParams({
      access_token: "messages,messaging_postbacks,messaging_optins,messaging_optouts,message_deliveries,message_reads,messaging_handovers,messaging_customer_information",
      subscribed_fields: pageAccess,
    });
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      console.log(`subscription updated.`);
    } else {
      console.warn(
        `Unable to callChangeSubscriptonAPI: ${response.statusText}`,
        await response.json()
      );
    }
  }
  
  static async callMessengerProfileAPI(requestBody) {
    // Send the HTTP request to the Messenger Profile API

    console.log(`Setting Messenger Profile for app ${config.appId}`);
    let url = new URL(`${config.apiUrl}/me/messenger_profile`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
    });
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      console.log(`Request sent.`);
    } else {
      console.warn(
        `Unable to callMessengerProfileAPI: ${response.statusText}`,
        await response.json()
      );
    }
  }

  static async callSubscriptionsAPI(customFields) {
    // Send the HTTP request to the Subscriptions Edge to configure your webhook
    // You can use the Graph API's /{app-id}/subscriptions edge to configure and
    // manage your app's Webhooks product
    // https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge
    console.log(
      `Setting app ${config.appId} callback url to ${config.webhookUrl}`
    );

    let fields =
      "messages, messaging_postbacks, messaging_optins, " +
      "message_deliveries, messaging_referrals";

    if (customFields !== undefined) {
      fields = fields + ", " + customFields;
    }

    console.log({ fields });

    let url = new URL(`${config.apiUrl}/${config.appId}/subscriptions`);
    url.search = new URLSearchParams({
      access_token: `${config.appId}|${config.appSecret}`,
      object: "page",
      callback_url: config.webhookUrl,
      verify_token: config.verifyToken,
      fields: fields,
      include_values: "true",
    });
    let response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      console.log(`Request sent.`);
    } else {
      console.error(
        `Unable to callSubscriptionsAPI: ${response.statusText}`,
        await response.json()
      );
    }
  }

  static async callSubscribedApps(customFields) {
    // Send the HTTP request to subscribe an app for Webhooks for Pages
    // You can use the Graph API's /{page-id}/subscribed_apps edge to configure
    // and manage your pages subscriptions
    // https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps
    console.log(`Subscribing app ${config.appId} to page ${config.pageId}`);

    let fields =
      "messages, messaging_postbacks, messaging_optins, " +
      "message_deliveries, messaging_referrals";

    if (customFields !== undefined) {
      fields = fields + ", " + customFields;
    }

    console.log({ fields });

    let url = new URL(`${config.apiUrl}/${config.pageId}/subscribed_apps`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
      subscribed_fields: fields,
    });
    let response = await fetch(url, {
      method: "POST",
    });
    if (response.ok) {
      console.log(`Request sent.`);
    } else {
      console.error(
        `Unable to callSubscribedApps: ${response.statusText}`,
        await response.json()
      );
    }
  }
  static async getUserProfile(senderIgsid) {
    let url = new URL(`${config.apiUrl}/${senderIgsid}`);
    url.search = new URLSearchParams({
      access_token: config.pageAccesToken,
      fields: "first_name, last_name, profile_pic"
    });
    let response = await fetch(url);
    if (response.ok) {
      let userProfile = await response.json();
      return {
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        profilePic: userProfile.profile_pic
      };
    } else {
      console.warn(
        `Could not load profile for ${senderIgsid}: ${response.statusText}`,
        await response.json()
      );
      return null;
    }
  }
};
