/* eslint-disable no-console */
require('dotenv').config()

const express = require('express');
const port = process.env.PORT || 4000;
const url = process.env.URL;
const hkaliyun = require('./bot/hkaliyun.js');
const airportsub = require('./bot/airportsub.js');
const app = express();
// parse the updates to JSON
app.use(express.json());
bots = [
  hkaliyun(app, url, process.env.TELEGRAM_TOKEN_HKALIYUN),
  airportsub(app, url, process.env.TELEGRAM_TOKEN_AIRPORTSUB),
];

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

for (const bot of bots) {
  bot.getMe().then((botInfo) => {
    console.log('Bot info:', botInfo);
  });
  bot.getWebHookInfo().then((webhookInfo) => {
    console.log('Webhook info:', webhookInfo);
  });
}