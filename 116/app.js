require('dotenv').config();
const express = require('express');
const client = require('./utils/db');
const taskRoute = require('./api/task');
const userRoute = require('./api/user');

const app = express();

app.use(async (req, res, next) => {
  await client;

  next();
});

app.use('/uploads', express.static('./uploads'));
app.use('/', taskRoute);
app.use('/', userRoute);

app.use((err, req, res, next) => {
  res.status(400).json({
    message: err.message,
  });
});

module.exports = app;
