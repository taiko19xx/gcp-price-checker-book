"use strict";

const firestore = require('@google-cloud/firestore');
const db = new firestore();

const scraper = require("../../lib/scraper");

const { WebClient } = require('@slack/web-api');
const slack = new WebClient();

const { Client: DiscordClient, Intents } = require('discord.js');
const discord = new DiscordClient({ intents: [Intents.FLAGS.GUILDS] });

exports.runChecker = async (site) => {
  try {
    const collection = db.collection('price_checker');
    const dataRef = await collection.where('site', '==', site).get();
    
    if (dataRef.empty) {
      return {
        result: true,
        message: 'no data'
      };
    }

    for (const object of dataRef.docs) {
      const currentData = object.data();
      const currentLog = `Title:${currentData.name} Price:${currentData.price}`;
      console.log(currentLog);

      const newData = await scraper.getData(currentData.target);

      if (!newData.result) {
        console.log(`Failed ${currentLog}`);
        continue;
      }

      const newLog = `${currentLog} => ${newData.data.price}`;
      console.log(newLog);
      if (currentData.price !== newData.data.price) {
        const chatMessage = `Price changed! ${newLog} Target:${newData.data.target}`;

        if (process.env.NOTICE_SLACK_CHANNEL) {
          await slack.chat.postMessage({
            token: process.env.NOTICE_SLACK_TOKEN,
            channel: process.env.NOTICE_SLACK_CHANNEL,
            text: chatMessage
          });
        }

        if (process.env.NOTICE_DISCORD_CHANNEL) {
          await discord.login(process.env.DISCORD_TOKEN);
          const channel = await discord.channels.fetch(process.env.NOTICE_DISCORD_CHANNEL);
          await channel.send(chatMessage);
        }

        await collection.doc(object.id).set(newData.data);
      }
    }

    return {
        result: true
    };
  } catch (e) {
    console.log(e);
    return {
      result: false,
      message: e.message
    }
  }
}