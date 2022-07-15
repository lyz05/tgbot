module.exports = (app) => {
    const TOKEN = process.env.TELEGRAM_TOKEN_HKALIYUN;
    const url = process.env.URL;
    const TelegramBot = require('node-telegram-bot-api');
    const bot = new TelegramBot(TOKEN);
    bot.setWebHook(`${url}/bot${TOKEN}`);

    // We are receiving updates at the route below!
    app.post(`/bot${TOKEN}`, (req, res) => {
        console.log("hkaliyun.js be called");
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });

    // Just to ping!
    bot.on('message', msg => {
        bot.sendMessage(msg.chat.id, 'alive');
    });
}