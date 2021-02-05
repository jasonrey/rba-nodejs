const mongoose = require('mongoose');

const User = mongoose.model('user', {
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  gender: String,
});

module.exports = User;
