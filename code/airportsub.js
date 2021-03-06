module.exports = (app) => {

    // Environment variables
    const TOKEN = process.env.TELEGRAM_TOKEN_AIRPORTSUB;
    const url = process.env.URL;
    const OSS_OPTIONS = {
        region: 'oss-cn-hongkong',
        accessKeyId: process.env.OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
        bucket: 'hkosslog'
    };

    // Import modules
    const YAML = require('yaml');
    const TelegramBot = require('node-telegram-bot-api');
    const { default: axios } = require('axios');
    const OSS = require('ali-oss');
    const client = new OSS(OSS_OPTIONS);

    let game = {};

    // No need to pass any parameters as we will handle the updates with Express
    const bot = new TelegramBot(TOKEN);
    bot.setWebHook(`${url}/bot${TOKEN}`);

    // We are receiving updates at the route below!
    app.post(`/bot${TOKEN}`, (req, res) => {
        console.log("airportsub.js be called");
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });

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
        bot.sendMessage(msg.chat.id, `Chat id: ${msg.chat.id}\n?????????id??????????????????????????????`);
    });

    bot.onText(/\/sub/, async (msg) => {
        const database = await (await client.get("SUB/database.yaml")).content.toString();
        const data = YAML.parse(database);
        const users = data.user;
        for (let user in users) {
            if (users[user].chatID == msg.chat.id) {
                bot.sendMessage(msg.chat.id, `?????????????????????????????????????????????`);
                bot.sendMessage(msg.chat.id, `?????????${user}???`);
                const url = `https://fc.home999.cc/sub?user=${user}`;
                bot.sendMessage(msg.chat.id, `????????????????????????${url}`);
                return;
            }
        }
        bot.sendMessage(msg.chat.id, `????????????????????????????????????????????????`);
    });

    bot.onText(/\/game/, (msg) => {
        const chatID = msg.chat.id;
        const guess = parseInt(msg.text.replace("/game", ""));
        if (game[chatID] == undefined) {
            game[chatID] = {
                num: Math.floor(Math.random() * 100),
                limit: 10,
            }
            bot.sendMessage(chatID, `??????????????????????????????`);
            bot.sendMessage(chatID, `????????????????????????10??????????????????:[0, 100)`);
            bot.sendMessage(chatID, `????????????????????????(??????/game 50)`);
            return;
        }
        let { num, limit } = game[chatID];
        if (limit <= 0) {
            bot.sendMessage(chatID, `?????????????????????????????????????????????????????????${num}`);
            game[chatID] = undefined;
            return;
        }
        game[chatID].limit--;
        if (guess == num) {
            bot.sendMessage(chatID, `?????????????????????`);
            game[chatID] = undefined;
        } else if (guess > num) {
            bot.sendMessage(chatID, `???????????????????????????`);
        } else {
            bot.sendMessage(chatID, `???????????????????????????`);
        }
    });

    bot.onText(/\/help/, (msg) => {
        bot.sendMessage(msg.chat.id, `/start - ????????????\n/game - ????????????\n/sub - ????????????\n/register - ??????\n/sendpic - ??????????????????`);
    });

}