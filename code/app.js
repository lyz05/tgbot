/* eslint-disable no-console */
require('dotenv').config()

const express = require('express');
const port = process.env.PORT || 4000;
const hkaliyun = require('./hkaliyun');
const airportsub = require('./airportsub');
const app = express();
// parse the updates to JSON
app.use(express.json());
hkaliyun(app);
airportsub(app);

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});