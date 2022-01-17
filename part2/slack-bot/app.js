"use strict";

const { App } = require('@slack/bolt');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

const firestore = require('@google-cloud/firestore');
const db = new firestore();

const { v4: uuidv4 } = require('uuid');
const scraper = require("../lib/scraper");

app.message('ping', async ({ say }) => {
  await say('pong');
});

app.message(/add_price:(.+)/, async ({ say, context }) => {
  try {
    const url = context.matches[1].slice(1).slice(0, -1).split('|')[0];
    const result = await scraper.getData(url);

    if (result.result === false) {
      throw new Error(result.message);
    }

    const collection = db.collection('price_checker');
    await collection.doc(uuidv4()).set(result.data);

    const response = `Registered! Title:${result.data.name} Price:${result.data.price}`;
    await say(response);
    console.log(response);
} catch (e) {
    console.log(e);
    await say(e.message);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('App is started');
})();