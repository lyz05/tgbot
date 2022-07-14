/* eslint-disable no-console */
require('dotenv').config()

const TOKEN = process.env.TELEGRAM_TOKEN;
const url = process.env.URL;
const port = process.env.PORT || 4000;

const TelegramBot = require('node-telegram-bot-api');
const options = {
    webHook: {
        // Just use 443 directly
        port: port
    }
};

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN, options);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);


// Just to ping!
bot.on('message', msg => {
    bot.sendMessage(msg.chat.id, 'I am alive! you said: ' + msg.text);
});

bot.onText(/\/start/, (msg) => {
    let name = [msg.from.first_name];
    if (msg.from.last_name) {
        name.push(msg.from.last_name);
    }
    name = name.join(" ");
    bot.sendMessage(msg.chat.id, `Welcome, ${name}!`);
});

bot.onText(/\/sendpic/, (msg) => {
    bot.getUserProfilePhotos(msg.chat.id).then(photos => {
        const photo = photos.photos[0][0];
        bot.sendPhoto(msg.chat.id, photo.file_id, {
            caption: "This is a picture of You!"
        });
    });
    // bot.sendPhoto(msg.chat.id, "https://blog.home999.cc/images/avatar.jpg");
});

bot.onText(/\/info/, (msg) => {
    bot.sendMessage(msg.chat.id, `Chat id: ${msg.chat.id}\n请把该id告诉管理员用于注册。`);
});

bot.onText(/\/sub/,(msg) => {
    bot.sendMessage(msg.chat.id, `您已经成功注册，请等待管理员审核`);
});

bot.onText(/\/game/,(msg) => {
    bot.sendMessage(msg.chat.id, `我们来玩猜数游戏吧！`);
});