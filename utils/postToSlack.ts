import { channel } from "diagnostics_channel";
import axios from "axios";

const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  //   appToken: process.env.SLACK_APP_TOKEN
});

export async function postSlackMessage(url: any, owner: any, request: any) {
  // let { title, dueDate, number, message } = request;
  // const blocks = [
  //   // {
  //   //   type: "section",
  //   //   text: {
  //   //     type: "mrkdwn",
  //   //     text: `About request: *<fakeLink.toEmployeeProfile.com|${number}>*`,

  //   //   },
  //   // },
  //   {
  //     type: "section",
  //     text: {
  //       type: "mrkdwn",
  //       // text: `You have a new request from:\n*<fakeLink.toEmployeeProfile.com|${owner}>*`,
  //       text: `${message}`,
  //     },
  //   },
  //   {
  //     type: "section",
  //     fields: [
  //       {
  //         type: "mrkdwn",
  //         text: `*Request ID:* ${number}`,
  //       },
  //       {
  //         type: "mrkdwn",
  //         text: `*Title:* ${title}`,
  //       },
  //       {
  //         type: "mrkdwn",
  //         text: `*Due date:* ${dueDate}`,
  //       },
  //       // {
  //       //   type: "mrkdwn",
  //       //   text: "*Last Update:*\nMar 10, 2015 (3 years, 5 months)",
  //       // },
  //       // {
  //       //   type: "mrkdwn",
  //       //   text: "*Reason:*\nAll vowel keys aren't working.",
  //       // },
  //       // {
  //       //   type: "mrkdwn",
  //       //   text: '*Specs:*\n"Cheetah Pro 15" - Fast, really fast"',
  //       // },
  //     ],
  //   },
  //   {
  //     type: "actions",
  //     elements: [
  //       {
  //         type: "button",
  //         text: {
  //           type: "plain_text",
  //           emoji: true,
  //           text: "Go to App",
  //         },
  //         style: "primary",
  //         value: "click_me_123",
  //         url,
  //       },
  //       // {
  //       //   type: "button",
  //       //   text: {
  //       //     type: "plain_text",
  //       //     emoji: true,
  //       //     text: "Deny",
  //       //   },
  //       //   style: "danger",
  //       //   value: "click_me_123",
  //       // },
  //     ],
  //   },
  // ];
  // await app.client.chat.postMessage({
  //   token: process.env.SLACK_TOKEN,
  //   channel: process.env.SLACK_CHANNEL,
  //   // channel: "higirobru",
  //   text: "Test hello",
  //   blocks,
  // });
}

// Function to invite a user to Slack
export async function inviteUser(email: any) {
  try {
    const result = await app.client.admin.invite({
      email,
      channels: [process.env.SLACK_CHANNEL],
    });

    if (result.ok) {
      console.log(`Invitation sent successfully to ${email}`);
      return result.user.id; // Return the user ID after sending the invitation
    } else {
      console.error(`Failed to send invitation: ${result.error}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error sending invitation: ${error.message}`);
    return null;
  }
}

// Function to get the user's ID after they accept the invitation
export async function getUserIdByEmail(email: any) {
  try {
    const result = await app.client.users.lookupByEmail({
      email,
    });

    if (result.ok) {
      console.log(`User ID for ${email}: ${result.user.id}`);
      return result.user.id;
    } else {
      console.error(`Failed to get user ID: ${result.error}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error getting user ID: ${error.message}`);
    return null;
  }
}

export async function getUsersListFromWorkspace() {
  try {
    let result = await app.client.users.list();

    if (result.ok) {
      console.log(`User list: ${JSON.stringify(result.members[1])}`);
      return result.members;
    } else {
      console.error(`Failed to get user ID: ${result.error}`);
      return null;
    }
  } catch (error: any) {
    console.error(`Error getting users list: ${error.message}`);
  }
}

// Function to send a message to a user
export async function sendMessage(userId: any, request: any, url: any) {
  let { title, dueDate, number, message, description, serviceCategory } = request;
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
          text: `*Description:* ${description}`,
        },
        {
          type: "mrkdwn",
          text: `*Service category:* ${serviceCategory}`,
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
  try {
    const result = await app.client.chat.postMessage({
      channel: userId,
      text: message,
      blocks,
    });

    if (result.ok) {
      console.log(`Message sent successfully to ${userId}`);
    } else {
      console.error(`Failed to send message: ${result.error}`);
    }
  } catch (error: any) {
    console.error(`Error sending message: ${error.message}`);
  }
}
