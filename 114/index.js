require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
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

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

async function shutdown() {
  console.log('Shutting down server');

  setTimeout(() => {
    console.error('Unable to close server successfully, forcing exit');

    process.exit(1);
  }, 10000);

  await new Promise((resolve) =>
    server.close((err) => {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }

      resolve();
    })
  );
  await mongoose.disconnect();

  console.log('Server closed, bye');

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
