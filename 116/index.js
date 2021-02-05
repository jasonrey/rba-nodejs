const mongoose = require('mongoose');

const app = require('./app');

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
