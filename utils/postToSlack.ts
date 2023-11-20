import { channel } from "diagnostics_channel";

const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  //   appToken: process.env.SLACK_APP_TOKEN
});

export async function postSlackMessage(url: any, owner: any, request: any) {
  let { title, dueDate, number, message } = request;
  const blocks = [
    // {
    //   type: "section",
    //   text: {
    //     type: "mrkdwn",
    //     text: `About request: *<fakeLink.toEmployeeProfile.com|${number}>*`,

    //   },
    // },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        // text: `You have a new request from:\n*<fakeLink.toEmployeeProfile.com|${owner}>*`,
        text: `${message}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Request ID:* ${number}`,
        },
        {
          type: "mrkdwn",
          text: `*Title:* ${title}`,
        },
        {
          type: "mrkdwn",
          text: `*Due date:* ${dueDate}`,
        },
        // {
        //   type: "mrkdwn",
        //   text: "*Last Update:*\nMar 10, 2015 (3 years, 5 months)",
        // },
        // {
        //   type: "mrkdwn",
        //   text: "*Reason:*\nAll vowel keys aren't working.",
        // },
        // {
        //   type: "mrkdwn",
        //   text: '*Specs:*\n"Cheetah Pro 15" - Fast, really fast"',
        // },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Go to App",
          },
          style: "primary",
          value: "click_me_123",
          url,
        },
        // {
        //   type: "button",
        //   text: {
        //     type: "plain_text",
        //     emoji: true,
        //     text: "Deny",
        //   },
        //   style: "danger",
        //   value: "click_me_123",
        // },
      ],
    },
  ];
  await app.client.chat.postMessage({
    token: process.env.SLACK_TOKEN,
    channel: process.env.SLACK_CHANNEL,
    text: "Test hello",
    blocks,
  });
}
