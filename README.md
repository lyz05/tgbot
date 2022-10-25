# tgbot
一个基于Node的Telegram BOT

# 安装依赖
```
curl -L https://fly.io/install.sh | sh
npm install
```

# 部署
```
npm run deploy
```

# 本地调试
使用Github Codespaces测试，记得将端口删除重新添加并改为Public，用以允许telegram的调用

准备.env文件在项目根目录
```
TELEGRAM_TOKEN_AIRPORTSUB=
TELEGRAM_TOKEN_HKALIYUN=
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
URL=https://lyz05-tgbot-977w997pw59f7964-4000.githubpreview.dev
```
运行
```
npm run dev
```