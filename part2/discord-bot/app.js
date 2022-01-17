"use strict";

const { Client: DiscordClient, Intents } = require('discord.js');
const client = new DiscordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const firestore = require('@google-cloud/firestore');
const db = new firestore();

const { v4: uuidv4 } = require('uuid');
const scraper = require("../lib/scraper");

client.on('ready', () => {
  console.log('App is started');
});

client.on('messageCreate', async (message) => {
  const content = message.content;
  if (content === 'ping') {
    message.channel.send('pong');
  }

  const regexp = /add_price:(.+)/;
  if (regexp.test(content)) {
    try {
      const url = regexp.exec(content)[1];
      const result = await scraper.getData(url);

      if (result.result === false) {
        throw new Error(result.message);
      }

      const collection = db.collection('price_checker');
      await collection.doc(uuidv4()).set(result.data);

      const response = `Registered! Title:${result.data.name} Price:${result.data.price}`;
      message.channel.send(response);
      console.log(response);

    } catch (e) {
      console.log(e);
      message.channel.send(e.message);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);