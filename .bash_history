curl -i -X POST "https://graph.facebook.com/106030262429449/subscribed_apps?subscribed_fields=messages&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -i -X POST "https://graph.facebook.com/106030262429449/subscribed_apps?subscribed_fields=messages&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy

curl -i -X POST "https://graph.facebook.com/106030262429449/subscribed_apps?subscribed_fields=messages&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -i -X POST "https://graph.facebook.com/106030262429449/subscribed_apps?subscribed_fields=messages&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy
curl -i -X POST "https://graph.facebook.com/106030262429449/subscribed_apps?subscribed_fields=messages&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -i -X GET "https://graph.facebook.com/106030262429449/subscribed_apps?subscribed_fields=messages&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X GET "localhost:1337/webhook?hub.verify_token=E9WSAAX4X4&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"5707552952688273"
  },
  "message":{
    "attachment":{
      "type":"template", 
      "payload":{
         "template_type":"notification_messages", 
          "title":"test-optin",
          "image_url":"https://picsum.photos/200",
          "payload": "promotional",
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/messages?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -i -X GET "https://graph.facebook.com/v16.0/106030262429449/notification_message_tokens
    ?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -i -X GET "https://graph.facebook.com/v16.0/106030262429449/notification_message_tokensaccess_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -i -X GET "https://graph.facebook.com/v16.0/106030262429449/notification_message_tokens?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "notification_messages_token": "8183222379117308817"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Welcome!",
            "image_url":"https://raw.githubusercontent.com/fbsamples/original-coast-clothing/main/public/styles/male-work.jpg",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://www.originalcoastclothing.com/",
              "webview_height_ratio": "tall"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.originalcoastclothing.com/",
                "title":"View Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"ADDITIONAL-WEBHOOK-INFORMATION"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/messages?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "notification_messages_token": "8183222379117308817"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"First msg!",
            "image_url":"https://picsum.photos/200",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://www.originalcoastclothing.com/",
              "webview_height_ratio": "tall"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.navency.com/",
                "title":"Check it out Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"ADDITIONAL-WEBHOOK-INFORMATION"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/messages?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST "https://graph.facebook.com/v16.0/106030262429449/notification_messages_dev_support?recipient={"notification_messages_token":"8183222379117308817"}&developer_action=ENABLE_FOLLOWUP_MESSAGE&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "notification_messages_token": "8183222379117308817"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"First msg!",
            "image_url":"https://picsum.photos/200",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://www.originalcoastclothing.com/",
              "webview_height_ratio": "tall"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.navency.com/",
                "title":"Check it out Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"ADDITIONAL-WEBHOOK-INFORMATION"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/messages?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "notification_messages_token": "8183222379117308817"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"First msg!",
            "image_url":"https://picsum.photos/200",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://www.originalcoastclothing.com/",
              "webview_height_ratio": "tall"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.navency.com/",
                "title":"Check it out Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"ADDITIONAL-WEBHOOK-INFORMATION"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/messages?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "notification_messages_token": "8183222379117308817"
  },
"developer_action":"ENABLE_FOLLOWUP)MESSAGE",
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"First msg!",
            "image_url":"https://picsum.photos/200",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://www.originalcoastclothing.com/",
              "webview_height_ratio": "tall"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.navency.com/",
                "title":"Check it out Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"ADDITIONAL-WEBHOOK-INFORMATION"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/messages?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "notification_messages_token": "8183222379117308817"
  },
"developer_action":"ENABLE_FOLLOWUP_MESSAGE",
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"First msg!",
            "image_url":"https://picsum.photos/200",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://www.originalcoastclothing.com/",
              "webview_height_ratio": "tall"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.navency.com/",
                "title":"Check it out Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"ADDITIONAL-WEBHOOK-INFORMATION"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/messages?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
url -X POST "https://graph.facebook.com/v16.0/106030262429449/notification_messages_dev_support?recipient={"notification_messages_token":"8183222379117308817"}&developer_action=ENABLE_FOLLOWUP_MESSAGE&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST "https://graph.facebook.com/v16.0/106030262429449/notification_messages_dev_support?recipient={"notification_messages_token":"8183222379117308817"}&developer_action=ENABLE_FOLLOWUP_MESSAGE&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST "https://graph.facebook.com/v16.0/106030262429449/notification_messages_dev_support?recipient={"notification_messages_token":"8183222379117308817"}&developer_action=ENABLE_FOLLOWUP_MESSAGE&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST "https://graph.facebook.com/v16.0/106030262429449/notification_messages_dev_support?recipient={'notification_messages_token':'8183222379117308817'}&developer_action=ENABLE_FOLLOWUP_MESSAGE&access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "notification_messages_token": "8183222379117308817"
  },
"developer_action":"ENABLE_FOLLOWUP_MESSAGE",
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"First msg!",
            "image_url":"https://picsum.photos/200",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://www.originalcoastclothing.com/",
              "webview_height_ratio": "tall"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.navency.com/",
                "title":"Check it out Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"ADDITIONAL-WEBHOOK-INFORMATION"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/notification_messages_dev_support?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "notification_messages_token": "8183222379117308817"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"First msg!",
            "image_url":"https://picsum.photos/200",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://www.originalcoastclothing.com/",
              "webview_height_ratio": "tall"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://www.navency.com/",
                "title":"Check it out Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"ADDITIONAL-WEBHOOK-INFORMATION"
              }              
            ]      
          }
        ]
      }
    }
  }
}' "https://graph.facebook.com/v16.0/106030262429449/messages?access_token=EAADKDK5b3jMBAKYsnwy3hRjsvDTozfgbSUmNnyCKnQ8ZBtvGQAfrPauAg9UPrqtonnV32ZCZBvvjBu7Au6CZBW7lQXazMju56qUXhgMBC6akHFFdZCYk2UOCoSMdPxkVoHcizYtSZBZAT4wgdqT2qp2yPXXpZAqCVatjeOZCzEXTx9Ah1BYuv4lmy"
 enable-pnpm
npm i yarn
npm i node-fetch
yarn add node-fetch
npm audit fix
node-fetch -version
npm i node-fetch
npm i yarn
yarn add node-fetch
pnpm i node-fetch
yarn add node-fetch
npm i node-fetch
 enable-pnpm
mongodb+srv://leebeensg:G1Ga1xtr6fyVs9W6@cluster0.qj3dtfz.mongodb.net/?retryWrites=true&w=majority
mongodb+srv://leebeensg:G1Ga1xtr6fyVs9W6@cluster0.qj3dtfz.mongodb.net/?retryWrites=true&w=majority
]npm install mongodb --save
npm install mongodb --save
npm uninstall mongodb
npm install mondgodb@v4.14
npm install mondgodb@V4.14
npm install mondgodb@4.14
npm install mondgodb@v4.13
npm install mondgodb@4.13
npm install mongodb@4.13
mongoexport --uri mongodb+srv://leebeensg:SbQ6tS7QJahoR7Do@cluster0.qj3dtfz.mongodb.net/NAVENCYMESSENGER --collection optIn --type csv --out test.csv
mongoexport --uri=”mongodb+srv://leebeensg:SbQ6tS7QJahoR7Do@cluster0.qj3dtfz.mongodb.net/navencymessenger” --collection optIn --type csv --out test.csv
mongoexport --help
mongoexport --version
npm update mongoexport
mongoexport --uri=”mongodb+srv://leebeensg:SbQ6tS7QJahoR7Do@cluster0.qj3dtfz.mongodb.net/navencymessenger” --collection optIn --type csv --out test.csv
mongoexport --version
mongoexport --uri=”mongodb+srv://leebeensg:SbQ6tS7QJahoR7Do@cluster0.qj3dtfz.mongodb.net/navencymessenger” --collection optIn --type csv --out test.csv
mongoexport mongodb+srv://leebeensg:SbQ6tS7QJahoR7Do@cluster0.qj3dtfz.mongodb.net/navencymessenger --collection optIn --type csv --out test.csv
mongoexport mongodb+srv://leebeensg:SbQ6tS7QJahoR7Do@cluster0.qj3dtfz.mongodb.net/navencymessenger --collection optIn --out test.csv
npm update mongoexport
mongoexport --version
npm install mongoexporty
npm install mongoexport
