/* eslint-disable no-console */
require('dotenv').config()

const TOKEN = process.env.TELEGRAM_TOKEN;
const url = process.env.URL;
const port = process.env.PORT || 4000;

const YAML = require('yaml');
const TelegramBot = require('node-telegram-bot-api');
const { default: axios } = require('axios');
const OSS = require('ali-oss');
const client = new OSS({
    region: 'oss-cn-hongkong',
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: 'hkosslog'
});


// No need to pass any parameters as we will handle the updates with Express
const options = {
    webHook: {
        // Just use 443 directly
        port: port
    }
};
const bot = new TelegramBot(TOKEN, options);
bot.setWebHook(`${url}/bot${TOKEN}`);


// Just to ping!
bot.on('message', msg => {
    if (!msg.text) {
        bot.sendMessage(msg.chat.id, 'I can only understand text messages!');
    }
});

bot.on('text', msg => {
    if (msg.text.indexOf('/') == -1) {
        bot.sendMessage(msg.chat.id, 'you said: ' + msg.text);
        axios.get('https://api.qingyunke.com/api.php?key=free&appid=0&msg=' + encodeURI(msg.text)).then(res => {
            console.log(res.data);
            bot.sendMessage(msg.chat.id, res.data.content);
        });
    }
});

bot.onText(/\/start/, (msg) => {
    let name = [msg.from.first_name];
    if (msg.from.last_name) {
        name.push(msg.from.last_name);
    }
    name = name.join(" ");
    bot.sendMessage(msg.chat.id, `Welcome, ${name}!`);
    bot.sendMessage(msg.chat.id, `You can send me any message and I will repeat it back to you.`);
    bot.sendMessage(msg.chat.id, `You can also send me commands like /start, /help.`);
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

bot.onText(/\/register/, (msg) => {
    bot.sendMessage(msg.chat.id, `Chat id: ${msg.chat.id}\n请把该id告诉管理员用于注册。`);
});

bot.onText(/\/sub/, async (msg) => {
    const database = await (await client.get("SUB/database.yaml")).content.toString();
    const data = YAML.parse(database);
    const users = data.user;
    for (let user in users) {
        if (users[user].chatID == msg.chat.id) {
            bot.sendMessage(msg.chat.id, `您已经注册过了，请勿重复注册。`);
            bot.sendMessage(msg.chat.id, `你好，${user}。`);
            const url = `https://fc.home999.cc/sub?user=${user}`;
            bot.sendMessage(msg.chat.id, `您的订阅链接为：${url}`);
            return;
        }
    }
    bot.sendMessage(msg.chat.id, `您已经成功注册，请等待管理员审核`);
});

bot.onText(/\/game/, (msg) => {
    bot.sendMessage(msg.chat.id, `我们来玩猜数游戏吧！`);
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, `/start - 欢迎界面\n/game - 猜数游戏\n/sub - 订阅链接\n/register - 注册\n/sendpic - 发送你的头像`);
});

