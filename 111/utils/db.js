const mongoose = require('mongoose');
const client = mongoose.connect(
  `mongodb://localhost:27017/${process.env.DB_NAME || 'rba'}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = client;
