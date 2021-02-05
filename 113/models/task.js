const mongoose = require('mongoose');

const Task = mongoose.model('task', {
  title: {
    type: String,
    required: true,
  },
});

module.exports = Task;
