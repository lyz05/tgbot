module.exports = (app,url,TOKEN) => {
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
        if (msg.text) {
            bot.sendMessage(msg.chat.id, msg.text);
        } else {
            bot.sendMessage(msg.chat.id, 'I can only understand text messages!');
        }
    });
    bot.on('video',msg => {
        bot.sendMessage(msg.chat.id, 'I reveive video message!');
        bot.sendMessage(msg.chat.id, JSON.stringify(msg.video));
    });
    bot.on('photo',msg => {
        bot.sendMessage(msg.chat.id, 'I reveive photo message!');
        bot.sendMessage(msg.chat.id, JSON.stringify(msg.photo));
    });
    bot.on('audio',msg => {
        bot.sendMessage(msg.chat.id, 'I reveive audio message!');
        bot.sendMessage(msg.chat.id, JSON.stringify(msg.audio));
    });
    bot.on('document',msg => {
        bot.sendMessage(msg.chat.id, 'I reveive document message!');
        bot.sendMessage(msg.chat.id, JSON.stringify(msg.document));
    });
    bot.on('sticker',msg => {
        bot.sendMessage(msg.chat.id, 'I reveive sticker message!');
        bot.sendMessage(msg.chat.id, JSON.stringify(msg.sticker));
    });
    bot.on('location',msg => {
        bot.sendMessage(msg.chat.id, 'I reveive location message!');
        bot.sendMessage(msg.chat.id, JSON.stringify(msg.location));
    });
    bot.on('contact',msg => {
        bot.sendMessage(msg.chat.id, 'I reveive contact message!');
        bot.sendMessage(msg.chat.id, JSON.stringify(msg.contact));
    });
    
    return bot;
}