const mongoose = require('mongoose');
const client = mongoose.connect(
  `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = client;
